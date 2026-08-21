package com.ayurtrace.service;

import com.ayurtrace.dto.*;
import com.ayurtrace.entity.*;
import com.ayurtrace.repository.*;
import com.ayurtrace.security.JwtUtils;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ManufacturerService {

    @Autowired private ManufacturerRepository manufacturerRepository;
    @Autowired private ManufacturerLoginRepository manufacturerLoginRepository;
    @Autowired private CultivationRequestRepository cultivationRequestRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private BatchRepository batchRepository;
    @Autowired private FarmerRepository farmerRepository;
    @Autowired private CultivationRepository cultivationRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private QrCodeRepository qrCodeRepository;
    @Autowired private SupervisorMessageRepository supervisorMessageRepository;
    @Autowired private NotificationRepository notificationRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtils jwtUtils;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    // ─── Helper ───────────────────────────────────────────────────────────────

    /** Resolves ManufacturerLogin and eagerly loads registration via JOIN FETCH. */
    @Transactional(readOnly = true)
    public ManufacturerLogin resolveLogin(String manufacturerId) {
        return manufacturerLoginRepository.findByManufacturerId(manufacturerId)
                .orElseThrow(() -> new RuntimeException("Manufacturer not found: " + manufacturerId));
    }

    private ManufacturerResponse toResponse(ManufacturerLogin ml) {
        ManufacturerResponse r = ManufacturerResponse.from(ml.getRegistration());
        r.setManufacturerId(ml.getManufacturerId());
        return r;
    }

    // ─── Registration ─────────────────────────────────────────────────────────

    @Transactional
    public ManufacturerResponse register(ManufacturerRegisterRequest request) {
        if (manufacturerRepository.existsByEmail(request.getEmail()))
            throw new RuntimeException("Email is already registered.");
        if (manufacturerRepository.existsByMobile(request.getMobile()))
            throw new RuntimeException("Mobile number is already registered.");
        if (request.getAyushLicenseNo() != null &&
                manufacturerRepository.existsByAyushLicenseNo(request.getAyushLicenseNo()))
            throw new RuntimeException("AYUSH license number is already registered.");
        if (request.getGstNumber() != null &&
                manufacturerRepository.existsByGstNumber(request.getGstNumber()))
            throw new RuntimeException("GST number is already registered.");

        Manufacturer mfg = new Manufacturer();
        mfg.setCompanyName(request.getCompanyName());
        mfg.setOwnerName(request.getOwnerName());
        mfg.setEmail(request.getEmail());
        mfg.setMobile(request.getMobile());
        mfg.setAyushLicenseNo(request.getAyushLicenseNo());
        mfg.setLicenseExpiry(request.getLicenseExpiry());
        mfg.setLicenseDocument(request.getLicenseDocument());
        mfg.setGstNumber(request.getGstNumber());
        mfg.setAddress(request.getAddress());
        mfg.setState(request.getState());
        mfg.setDistrict(request.getDistrict());
        mfg.setPincode(request.getPincode());
        mfg.setPassword(passwordEncoder.encode(request.getPassword()));
        mfg.setStatus(ManufacturerStatus.PENDING);
        manufacturerRepository.save(mfg);
        return ManufacturerResponse.from(mfg);
    }

    // ─── Login ────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public AuthResponse login(ManufacturerLoginRequest request) {
        ManufacturerLogin ml = manufacturerLoginRepository.findByManufacturerId(request.getManufacturerId())
                .orElseThrow(() -> new RuntimeException("Invalid Manufacturer ID or password."));

        if (ml.getAccountStatus() == ManufacturerAccountStatus.BLOCKED)
            throw new RuntimeException("Manufacturer account is blocked");

        Manufacturer mfg = ml.getRegistration();

        if (mfg.getStatus() == ManufacturerStatus.PENDING)
            throw new RuntimeException("Manufacturer application is still pending approval");
        if (mfg.getStatus() == ManufacturerStatus.REJECTED)
            throw new RuntimeException("Manufacturer application has been rejected");

        if (!passwordEncoder.matches(request.getPassword(), mfg.getPassword()))
            throw new RuntimeException("Invalid Manufacturer ID or password.");

        org.springframework.security.core.userdetails.User principal =
                new org.springframework.security.core.userdetails.User(
                        ml.getManufacturerId(), mfg.getPassword(),
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_MANUFACTURER")));
        Authentication auth = new UsernamePasswordAuthenticationToken(
                principal, null, principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);

        AuthResponse response = new AuthResponse(jwtUtils.generateJwtToken(auth), ml.getManufacturerId(), "ROLE_MANUFACTURER", mfg.getId());
        response.setCompanyName(mfg.getCompanyName());
        return response;
    }

    // ─── Profile ─────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public ManufacturerResponse getProfile(String manufacturerId) {
        return toResponse(resolveLogin(manufacturerId));
    }

    @Transactional
    public ManufacturerResponse updateProfile(String manufacturerId, ManufacturerRegisterRequest req) {
        ManufacturerLogin ml = resolveLogin(manufacturerId);
        Manufacturer mfg = ml.getRegistration();
        mfg.setCompanyName(req.getCompanyName());
        mfg.setOwnerName(req.getOwnerName());
        mfg.setMobile(req.getMobile());
        if (req.getAyushLicenseNo() != null) mfg.setAyushLicenseNo(req.getAyushLicenseNo());
        if (req.getLicenseExpiry() != null) mfg.setLicenseExpiry(req.getLicenseExpiry());
        if (req.getGstNumber() != null) mfg.setGstNumber(req.getGstNumber());
        mfg.setAddress(req.getAddress());
        mfg.setState(req.getState());
        mfg.setDistrict(req.getDistrict());
        mfg.setPincode(req.getPincode());
        manufacturerRepository.save(mfg);
        return toResponse(ml);
    }

    // ─── Dashboard Stats ─────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public ManufacturerDashboardStats getDashboardStats(String manufacturerId) {
        ManufacturerLogin ml = resolveLogin(manufacturerId);
        Manufacturer mfg = ml.getRegistration();

        long totalProducts = productRepository.countByManufacturer(mfg);
        List<Farmer> farmers = farmerRepository.findBySupervisorId(mfg.getId());

        long totalBatches = farmers.stream()
                .mapToLong(f -> batchRepository.findByFarmerId(f.getId()).size())
                .sum();

        long batchesReceived = farmers.stream()
                .flatMap(f -> batchRepository.findByFarmerId(f.getId()).stream())
                .filter(b -> b.getStatus() != BatchStatus.CREATED)
                .count();

        List<Order> orders = orderRepository.findByManufacturerId(mfg.getId());
        long ordersReceived = orders.size();
        long ordersPending = orders.stream().filter(o -> "PLACED".equals(o.getStatus()) || "PENDING".equals(o.getStatus())).count();
        long qrCount = qrCodeRepository.countByManufacturer(mfg);

        long productsSold = orders.stream()
                .filter(o -> "DELIVERED".equals(o.getStatus()) || "COMPLETED".equals(o.getStatus()))
                .flatMap(o -> o.getItems().stream())
                .filter(i -> i.getProduct().getManufacturer() != null
                        && i.getProduct().getManufacturer().getId().equals(mfg.getId()))
                .mapToLong(i -> i.getQuantity() != null ? i.getQuantity() : 0L)
                .sum();

        return new ManufacturerDashboardStats(
                totalProducts, totalBatches, batchesReceived,
                ordersReceived, ordersPending, productsSold, qrCount, (long) farmers.size());
    }

    // ─── Farmers ─────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<FarmerResponse> getAssignedFarmers(String manufacturerId) {
        ManufacturerLogin ml = resolveLogin(manufacturerId);
        return farmerRepository.findBySupervisorId(ml.getRegistration().getId())
                .stream().map(FarmerResponse::from).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FarmerResponse> getAllActiveFarmers() {
        return farmerRepository.findByStatus(FarmerStatus.ACTIVE)
                .stream().map(FarmerResponse::from).collect(Collectors.toList());
    }

    @Transactional
    public void assignFarmer(String manufacturerId, Long farmerId) {
        ManufacturerLogin ml = resolveLogin(manufacturerId);
        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new RuntimeException("Farmer not found: " + farmerId));
        farmer.setSupervisorId(ml.getRegistration().getId());
        farmerRepository.save(farmer);
    }

    // ─── Supervisor Messages ─────────────────────────────────────────────────

    @Transactional
    public SupervisorMessageResponse sendMessage(String manufacturerId, SupervisorMessageRequest req) {
        ManufacturerLogin ml = resolveLogin(manufacturerId);
        Farmer farmer = farmerRepository.findById(req.getFarmerId())
                .orElseThrow(() -> new RuntimeException("Farmer not found: " + req.getFarmerId()));

        SupervisorMessage msg = new SupervisorMessage();
        msg.setManufacturer(ml.getRegistration());
        msg.setFarmer(farmer);
        msg.setSubject(req.getSubject());
        msg.setMessage(req.getMessage());
        msg.setStatus(SupervisorMessageStatus.PENDING);
        supervisorMessageRepository.save(msg);

        // Notify farmer — stored by farmer DB id
        Notification notif = new Notification();
        notif.setUserId(farmer.getId());
        notif.setUserRole("ROLE_FARMER");
        notif.setMessage("[Supervisor — " + ml.getRegistration().getCompanyName() + "] " +
                req.getSubject() + ": " + req.getMessage());
        notif.setRead(false);
        notif.setTimestamp(LocalDateTime.now());
        notificationRepository.save(notif);

        return buildMessageResponse(msg);
    }

    @Transactional(readOnly = true)
    public List<SupervisorMessageResponse> getMessages(String manufacturerId) {
        ManufacturerLogin ml = resolveLogin(manufacturerId);
        // JOIN FETCH already loads manufacturer + farmer in query
        return supervisorMessageRepository
                .findByManufacturerOrderByCreatedAtDesc(ml.getRegistration())
                .stream()
                .map(this::buildMessageResponse)
                .collect(Collectors.toList());
    }

    /** Build DTO inside transaction so associations are still accessible. */
    private SupervisorMessageResponse buildMessageResponse(SupervisorMessage m) {
        SupervisorMessageResponse r = new SupervisorMessageResponse();
        r.setId(m.getId());
        r.setSubject(m.getSubject());
        r.setMessage(m.getMessage());
        r.setStatus(m.getStatus());
        r.setCreatedAt(m.getCreatedAt());
        if (m.getManufacturer() != null) {
            r.setManufacturerDbId(m.getManufacturer().getId());
            r.setManufacturerCompanyName(m.getManufacturer().getCompanyName());
        }
        if (m.getFarmer() != null) {
            r.setFarmerDbId(m.getFarmer().getId());
            r.setFarmerFarmerId(m.getFarmer().getFarmerId());
            r.setFarmerName(m.getFarmer().getFullName());
        }
        return r;
    }

    // ─── Cultivations ────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<?> getCultivationsForManufacturer(String manufacturerId) {
        ManufacturerLogin ml = resolveLogin(manufacturerId);
        List<Farmer> farmers = farmerRepository.findBySupervisorId(ml.getRegistration().getId());
        return farmers.stream()
                .flatMap(f -> cultivationRepository.findByFarmerId(f.getId()).stream())
                .collect(Collectors.toList());
    }

    // ─── Cultivation Requests ──────────────────────────────────────────────────

    @Transactional
    public void expressInterest(String manufacturerId, CultivationRequestDTO dto) {
        ManufacturerLogin ml = resolveLogin(manufacturerId);
        Cultivation cultivation = cultivationRepository.findById(dto.getCultivationId())
                .orElseThrow(() -> new RuntimeException("Cultivation not found: " + dto.getCultivationId()));

        CultivationRequest request = new CultivationRequest();
        request.setManufacturer(ml.getRegistration());
        request.setCultivation(cultivation);
        request.setFarmer(cultivation.getFarmer());
        request.setMessage(dto.getMessage());
        request.setOfferedPrice(dto.getOfferedPrice());
        request.setQuantity(dto.getQuantity());
        request.setStatus(CultivationRequestStatus.PENDING);
        cultivationRequestRepository.save(request);

        // Notify farmer
        Notification notif = new Notification();
        notif.setUserId(cultivation.getFarmer().getId());
        notif.setUserRole("ROLE_FARMER");
        notif.setMessage("New manufacturer interest for your " + cultivation.getHerbName() +
                " from " + ml.getRegistration().getCompanyName());
        notif.setRead(false);
        notif.setTimestamp(LocalDateTime.now());
        notificationRepository.save(notif);
    }

    @Transactional(readOnly = true)
    public List<CultivationRequest> getSentRequests(String manufacturerId) {
        ManufacturerLogin ml = resolveLogin(manufacturerId);
        return cultivationRequestRepository.findByManufacturer(ml.getRegistration());
    }

    // ─── Batches ─────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<BatchResponse> getBatchesForManufacturer(String manufacturerId) {
        ManufacturerLogin ml = resolveLogin(manufacturerId);
        List<Farmer> farmers = farmerRepository.findBySupervisorId(ml.getRegistration().getId());
        return farmers.stream()
                .flatMap(f -> batchRepository.findByFarmerId(f.getId()).stream())
                .map(BatchResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BatchResponse> getAllBatches() {
        return batchRepository.findAll().stream()
                .map(BatchResponse::from).collect(Collectors.toList());
    }

    @Transactional
    public BatchResponse updateBatchStatus(Long batchId, String status) {
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found: " + batchId));
        batch.setStatus(BatchStatus.valueOf(status));
        batchRepository.save(batch);
        return BatchResponse.from(batch);
    }

    // ─── Products ────────────────────────────────────────────────────────────

    @Transactional
    public ProductResponse createProduct(String manufacturerId, ProductRequest req, String imageUrl) {
        ManufacturerLogin ml = resolveLogin(manufacturerId);
        Manufacturer mfg = ml.getRegistration();

        Product p = new Product();
        p.setName(req.getName());
        p.setDescription(req.getDescription());
        p.setCategory(req.getCategory());
        p.setPrice(req.getPrice());
        p.setStockQuantity(req.getStockQuantity());
        p.setQualityInfo(req.getQualityInfo());
        p.setManufacturingDate(req.getManufacturingDate());
        p.setExpiryDate(req.getExpiryDate());
        p.setManufacturerDetails(mfg.getCompanyName());
        p.setManufacturer(mfg);
        p.setImageUrl(imageUrl);
        p.setProductStatus(ProductStatus.ACTIVE);

        if (req.getBatchId() != null) {
            Batch batch = batchRepository.findById(req.getBatchId())
                    .orElseThrow(() -> new RuntimeException("Batch not found: " + req.getBatchId()));
            p.setBatch(batch);
        }
        productRepository.save(p);
        return ProductResponse.from(p, manufacturerId);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getProducts(String manufacturerId) {
        ManufacturerLogin ml = resolveLogin(manufacturerId);
        return productRepository.findByManufacturerOrderByCreatedAtDesc(ml.getRegistration())
                .stream().map(p -> ProductResponse.from(p, manufacturerId))
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductResponse updateProduct(String manufacturerId, Long productId,
                                         ProductRequest req, String imageUrl) {
        ManufacturerLogin ml = resolveLogin(manufacturerId);
        Product p = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));
        if (!p.getManufacturer().getId().equals(ml.getRegistration().getId()))
            throw new RuntimeException("Unauthorized: product does not belong to this manufacturer.");

        p.setName(req.getName());
        p.setDescription(req.getDescription());
        p.setCategory(req.getCategory());
        p.setPrice(req.getPrice());
        p.setStockQuantity(req.getStockQuantity());
        p.setQualityInfo(req.getQualityInfo());
        p.setManufacturingDate(req.getManufacturingDate());
        p.setExpiryDate(req.getExpiryDate());
        if (imageUrl != null) p.setImageUrl(imageUrl);
        if (req.getBatchId() != null) {
            Batch batch = batchRepository.findById(req.getBatchId())
                    .orElseThrow(() -> new RuntimeException("Batch not found: " + req.getBatchId()));
            p.setBatch(batch);
        }
        productRepository.save(p);
        return ProductResponse.from(p, manufacturerId);
    }

    // ─── QR Codes ────────────────────────────────────────────────────────────

    @Transactional
    public QrCodeResponse generateQrCode(String manufacturerId, Long productId) {
        ManufacturerLogin ml = resolveLogin(manufacturerId);
        Manufacturer mfg = ml.getRegistration();

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));
        if (product.getManufacturer() == null || !product.getManufacturer().getId().equals(mfg.getId()))
            throw new RuntimeException("Unauthorized: product does not belong to this manufacturer.");
        if (product.getBatch() == null)
            throw new RuntimeException("Product has no associated batch. Link a batch before generating QR.");

        // Unique QR ID
        long seq = qrCodeRepository.count() + 1;
        String qrId = "AYR-QR-" + String.format("%06d", seq);
        while (qrCodeRepository.existsByQrId(qrId)) {
            seq++;
            qrId = "AYR-QR-" + String.format("%06d", seq);
        }

        String imagePath = generateQrImage(qrId);

        QrCode qr = new QrCode();
        qr.setQrId(qrId);
        qr.setProduct(product);
        qr.setBatch(product.getBatch());
        qr.setManufacturer(mfg);
        qr.setQrImagePath(imagePath);
        qr.setGeneratedAt(LocalDateTime.now());
        qrCodeRepository.save(qr);

        // Also stamp the batch qrCode field for legacy Flutter lookup
        product.getBatch().setQrCode(qrId);
        batchRepository.save(product.getBatch());

        return buildQrResponse(qr, manufacturerId);
    }

    @Transactional(readOnly = true)
    public List<QrCodeResponse> getQrCodes(String manufacturerId) {
        ManufacturerLogin ml = resolveLogin(manufacturerId);
        return qrCodeRepository.findByManufacturerOrderByGeneratedAtDesc(ml.getRegistration())
                .stream().map(q -> buildQrResponse(q, manufacturerId))
                .collect(Collectors.toList());
    }

    private QrCodeResponse buildQrResponse(QrCode q, String manufacturerIdCode) {
        QrCodeResponse r = new QrCodeResponse();
        r.setId(q.getId());
        r.setQrId(q.getQrId());
        r.setQrImagePath(q.getQrImagePath());
        r.setGeneratedAt(q.getGeneratedAt());
        if (q.getProduct() != null) {
            r.setProductId(q.getProduct().getId());
            r.setProductName(q.getProduct().getName());
        }
        if (q.getBatch() != null) {
            r.setBatchId(q.getBatch().getId());
            r.setBatchNumber(q.getBatch().getBatchNumber());
        }
        if (q.getManufacturer() != null) {
            r.setManufacturerDbId(q.getManufacturer().getId());
            r.setManufacturerCompanyName(q.getManufacturer().getCompanyName());
            r.setManufacturerIdCode(manufacturerIdCode);
        }
        return r;
    }

    private String generateQrImage(String qrId) {
        try {
            String base = (uploadDir != null && !uploadDir.isBlank()) ? uploadDir : "uploads";
            Path dir = Paths.get(base, "qr");
            Files.createDirectories(dir);
            String filename = qrId.replace(":", "-") + ".png";
            Path filePath = dir.resolve(filename);
            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.MARGIN, 1);
            BitMatrix matrix = new MultiFormatWriter()
                    .encode(qrId, BarcodeFormat.QR_CODE, 300, 300, hints);
            MatrixToImageWriter.writeToPath(matrix, "PNG", filePath);
            return "/uploads/qr/" + filename;
        } catch (Exception e) {
            return null;
        }
    }

    // ─── Traceability ─────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public TraceabilityResponse getTraceabilityByQrId(String qrId) {
        QrCode qr = qrCodeRepository.findByQrId(qrId)
                .orElseThrow(() -> new RuntimeException("QR code not found: " + qrId));
        return buildTraceability(qr);
    }

    @Transactional(readOnly = true)
    public TraceabilityResponse buildTraceabilityFromBatch(Batch batch) {
        TraceabilityResponse r = new TraceabilityResponse();
        r.setQrId(batch.getQrCode());
        
        // Find product associated with this batch
        productRepository.findAll().stream()
                .filter(p -> p.getBatch() != null && p.getBatch().getId().equals(batch.getId()))
                .findFirst()
                .ifPresent(p -> {
                    r.setProductId(p.getId());
                    r.setProductName(p.getName());
                    r.setProductDescription(p.getDescription());
                    r.setProductPrice(p.getPrice());
                    r.setManufacturingDate(p.getManufacturingDate());
                    r.setExpiryDate(p.getExpiryDate());
                    r.setProductImageUrl(p.getImageUrl());
                    
                    if (p.getManufacturer() != null) {
                        Manufacturer mfg = p.getManufacturer();
                        r.setManufacturerDbId(mfg.getId());
                        r.setManufacturerCompanyName(mfg.getCompanyName());
                        r.setManufacturerOwnerName(mfg.getOwnerName());
                        r.setManufacturerState(mfg.getState());
                        r.setManufacturerDistrict(mfg.getDistrict());
                        manufacturerLoginRepository.findByRegistration(mfg)
                                .ifPresent(ml -> r.setManufacturerIdCode(ml.getManufacturerId()));
                    }
                });

        // Fill Batch info
        r.setBatchId(batch.getId());
        r.setBatchNumber(batch.getBatchNumber());
        r.setBatchQuantity(batch.getQuantity());
        r.setBatchQuantityUnit(batch.getQuantityUnit());
        r.setHarvestDate(batch.getHarvestDate());
        r.setBatchLocation(batch.getLocation());

        // Fill Cultivation & Farmer info
        Cultivation cult = batch.getCultivation();
        if (cult != null) {
            r.setCultivationId(cult.getId());
            r.setHerbName(cult.getHerbName());
            r.setCultivationMethod(cult.getCultivationMethod());
            r.setPlantingDate(cult.getPlantingDate());
            r.setExpectedHarvestDate(cult.getExpectedHarvestDate());
            r.setCultivationLocation(cult.getLocation());
            r.setCultivationLatitude(cult.getLatitude());
            r.setCultivationLongitude(cult.getLongitude());

            Farmer farmer = cult.getFarmer();
            if (farmer != null) {
                r.setFarmerDbId(farmer.getId());
                r.setFarmerId(farmer.getFarmerId());
                r.setFarmerName(farmer.getFullName());
                r.setFarmerState(farmer.getState());
                r.setFarmerDistrict(farmer.getDistrict());
                r.setFarmerLatitude(farmer.getLatitude());
                r.setFarmerLongitude(farmer.getLongitude());
            }
        }
        
        return r;
    }

    private TraceabilityResponse buildTraceability(QrCode qr) {
        TraceabilityResponse r = new TraceabilityResponse();
        r.setQrId(qr.getQrId());
        r.setQrGeneratedAt(qr.getGeneratedAt());

        // Product
        Product p = qr.getProduct();
        if (p != null) {
            r.setProductId(p.getId());
            r.setProductName(p.getName());
            r.setProductDescription(p.getDescription());
            r.setProductPrice(p.getPrice());
            r.setManufacturingDate(p.getManufacturingDate());
            r.setExpiryDate(p.getExpiryDate());
            r.setProductImageUrl(p.getImageUrl());
        }

        // Manufacturer
        Manufacturer mfg = qr.getManufacturer();
        if (mfg != null) {
            r.setManufacturerDbId(mfg.getId());
            r.setManufacturerCompanyName(mfg.getCompanyName());
            r.setManufacturerOwnerName(mfg.getOwnerName());
            r.setManufacturerState(mfg.getState());
            r.setManufacturerDistrict(mfg.getDistrict());
            manufacturerLoginRepository.findByRegistration(mfg)
                    .ifPresent(ml -> r.setManufacturerIdCode(ml.getManufacturerId()));
        }

        // Batch + Cultivation + Farmer — use full JOIN FETCH query
        if (qr.getBatch() != null) {
            batchRepository.findByIdWithFull(qr.getBatch().getId()).ifPresent(batch -> {
                r.setBatchId(batch.getId());
                r.setBatchNumber(batch.getBatchNumber());
                r.setBatchQuantity(batch.getQuantity());
                r.setBatchQuantityUnit(batch.getQuantityUnit());
                r.setHarvestDate(batch.getHarvestDate());
                r.setBatchLocation(batch.getLocation());

                Cultivation cult = batch.getCultivation();
                if (cult != null) {
                    r.setCultivationId(cult.getId());
                    r.setHerbName(cult.getHerbName());
                    r.setCultivationMethod(cult.getCultivationMethod());
                    r.setPlantingDate(cult.getPlantingDate());
                    r.setExpectedHarvestDate(cult.getExpectedHarvestDate());
                    r.setCultivationLocation(cult.getLocation());
                    r.setCultivationLatitude(cult.getLatitude());
                    r.setCultivationLongitude(cult.getLongitude());

                    Farmer farmer = cult.getFarmer();
                    if (farmer != null) {
                        r.setFarmerDbId(farmer.getId());
                        r.setFarmerId(farmer.getFarmerId());
                        r.setFarmerName(farmer.getFullName());
                        r.setFarmerState(farmer.getState());
                        r.setFarmerDistrict(farmer.getDistrict());
                        r.setFarmerLatitude(farmer.getLatitude());
                        r.setFarmerLongitude(farmer.getLongitude());
                    }
                }
            });
        }
        return r;
    }

    // ─── Orders ──────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrders(String manufacturerId) {
        ManufacturerLogin ml = resolveLogin(manufacturerId);
        return orderRepository.findByManufacturerId(ml.getRegistration().getId())
                .stream().map(this::buildOrderResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateOrderStatus(String manufacturerId, Long orderId, String status) {
        ManufacturerLogin ml = resolveLogin(manufacturerId);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        boolean owns = order.getItems().stream().anyMatch(i ->
                i.getProduct().getManufacturer() != null &&
                i.getProduct().getManufacturer().getId().equals(ml.getRegistration().getId()));
        if (!owns)
            throw new RuntimeException("Unauthorized: order does not belong to this manufacturer.");

        order.setStatus(status);
        orderRepository.save(order);

        if (order.getCustomer() != null) {
            Notification notif = new Notification();
            notif.setUserId(order.getCustomer().getId());
            notif.setUserRole("ROLE_CUSTOMER");
            notif.setMessage("Your order #" + orderId + " status has been updated to: " + status);
            notif.setRead(false);
            notif.setTimestamp(LocalDateTime.now());
            notificationRepository.save(notif);
        }

        return buildOrderResponse(order);
    }

    private OrderResponse buildOrderResponse(Order o) {
        OrderResponse r = new OrderResponse();
        r.setId(o.getId());
        if (o.getCustomer() != null) {
            r.setCustomerName(o.getCustomer().getFullName());
            r.setCustomerMobile(o.getCustomer().getMobile());
        }
        r.setTotalAmount(o.getTotalAmount());
        r.setStatus(o.getStatus());
        r.setPaymentMethod(o.getPaymentMethod());
        r.setPaymentStatus(o.getPaymentStatus());
        r.setOrderDate(o.getOrderDate());
        r.setItems(o.getItems().stream().map(i -> {
            OrderResponse.OrderItemResponse ir = new OrderResponse.OrderItemResponse();
            ir.setProductId(i.getProduct().getId());
            ir.setProductName(i.getProduct().getName());
            ir.setQuantity(i.getQuantity());
            ir.setPrice(i.getPrice());
            return ir;
        }).collect(Collectors.toList()));
        return r;
    }

    // ─── Analytics ───────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public Map<String, Object> getAnalytics(String manufacturerId) {
        ManufacturerLogin ml = resolveLogin(manufacturerId);
        Manufacturer mfg = ml.getRegistration();

        List<Farmer> farmers = farmerRepository.findBySupervisorId(mfg.getId());
        List<Batch> allBatches = farmers.stream()
                .flatMap(f -> batchRepository.findByFarmerId(f.getId()).stream())
                .collect(Collectors.toList());

        List<Order> orders = orderRepository.findByManufacturerId(mfg.getId());
        List<Product> products = productRepository.findByManufacturer(mfg);

        long pendingOrders   = orders.stream().filter(o -> "PLACED".equals(o.getStatus()) || "PENDING".equals(o.getStatus())).count();
        long confirmedOrders = orders.stream().filter(o -> "CONFIRMED".equals(o.getStatus())).count();
        long deliveredOrders = orders.stream().filter(o -> "DELIVERED".equals(o.getStatus())).count();
        long cancelledOrders = orders.stream().filter(o -> "CANCELLED".equals(o.getStatus())).count();
        long batchesProcessed = allBatches.stream().filter(b -> b.getStatus() == BatchStatus.COMPLETED).count();

        BigDecimal totalSales = orders.stream()
                .filter(o -> "DELIVERED".equals(o.getStatus()) || "COMPLETED".equals(o.getStatus()))
                .map(Order::getTotalAmount).filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalBatchesReceived",  allBatches.size());
        result.put("totalBatchesProcessed", batchesProcessed);
        result.put("totalProducts",         products.size());
        result.put("totalOrders",           orders.size());
        result.put("pendingOrders",         pendingOrders);
        result.put("confirmedOrders",       confirmedOrders);
        result.put("deliveredOrders",       deliveredOrders);
        result.put("cancelledOrders",       cancelledOrders);
        result.put("totalSales",            totalSales);
        result.put("qrCodesGenerated",      qrCodeRepository.countByManufacturer(mfg));
        return result;
    }

    // ─── Notifications ────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<Notification> getNotifications(String manufacturerId) {
        ManufacturerLogin ml = resolveLogin(manufacturerId);
        return notificationRepository.findByUserIdAndUserRoleOrderByTimestampDesc(
                ml.getRegistration().getId(), "ROLE_MANUFACTURER");
    }

    @Transactional
    public void markNotificationRead(String manufacturerId, Long notifId) {
        Notification n = notificationRepository.findById(notifId)
                .orElseThrow(() -> new RuntimeException("Notification not found: " + notifId));
        n.setRead(true);
        notificationRepository.save(n);
    }
}
