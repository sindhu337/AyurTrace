package com.ayurtrace.controller;

import com.ayurtrace.dto.ApiResponse;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
public class FileUploadController {

    @Value("${app.upload.dir:uploads}")
    private String uploadDirProp;

    // Static so ManufacturerController can call it without injection
    private static String UPLOAD_BASE = "uploads";

    @PostConstruct
    public void init() {
        UPLOAD_BASE = uploadDirProp;
    }

    /**
     * Upload a file under a sub-directory (e.g. "licenses", "products", "qr").
     * Returns the accessible URL path.
     */
    @PostMapping("/upload/{folder}")
    public ResponseEntity<?> upload(@PathVariable String folder,
                                    @RequestParam("file") MultipartFile file) {
        try {
            String url = saveFile(file, folder);
            return ResponseEntity.ok(ApiResponse.ok("File uploaded successfully.", url));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("File upload failed: " + e.getMessage()));
        }
    }

    /**
     * Static helper callable from other controllers.
     * Uses the upload base resolved from application.properties.
     */
    public static String saveFile(MultipartFile file, String folder) {
        try {
            Path dir = Paths.get(UPLOAD_BASE, folder);
            Files.createDirectories(dir);

            String originalName = file.getOriginalFilename();
            String ext = "";
            if (originalName != null && originalName.contains(".")) {
                ext = originalName.substring(originalName.lastIndexOf("."));
            }
            String filename = UUID.randomUUID() + ext;
            Path dest = dir.resolve(filename);
            Files.copy(file.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/" + folder + "/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage());
        }
    }
}
