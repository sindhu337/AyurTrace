package com.ayurtrace.service;

import com.ayurtrace.dto.FarmerDashboardStats;
import com.ayurtrace.dto.CultivationRequestResponse;
import com.ayurtrace.entity.*;
import com.ayurtrace.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FarmerService {

    @Autowired private CultivationRepository cultivationRepository;
    @Autowired private CultivationRequestRepository cultivationRequestRepository;
    @Autowired private BatchRepository batchRepository;
    @Autowired private MessageRepository messageRepository;
    @Autowired private NotificationRepository notificationRepository;
    @Autowired private FarmerRepository farmerRepository;
    @Autowired private CustomerRepository customerRepository;

    // ─── Cultivation ─────────────────────────────────────────────────────────

    @Transactional
    public Cultivation addCultivation(Farmer farmer, Cultivation cultivation) {
        cultivation.setFarmer(farmer);
        if (cultivation.getStatus() == null) {
            cultivation.setStatus(CultivationStatus.PLANTED);
        }
        return cultivationRepository.save(cultivation);
    }

    @Transactional(readOnly = true)
    public List<Cultivation> getCultivations(Farmer farmer) {
        // JOIN FETCH ensures farmer is loaded — safe to serialize
        return cultivationRepository.findByFarmer(farmer);
    }

    @Transactional
    public Cultivation updateCultivation(Long id, Cultivation details) {
        Cultivation cultivation = cultivationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cultivation not found with id: " + id));
        cultivation.setHerbName(details.getHerbName());
        cultivation.setArea(details.getArea());
        cultivation.setAreaUnit(details.getAreaUnit());
        cultivation.setCultivationMethod(details.getCultivationMethod());
        cultivation.setPlantingDate(details.getPlantingDate());
        cultivation.setExpectedHarvestDate(details.getExpectedHarvestDate());
        cultivation.setExpectedQuantity(details.getExpectedQuantity());
        cultivation.setQuantityUnit(details.getQuantityUnit());
        cultivation.setPrice(details.getPrice());
        cultivation.setLocation(details.getLocation());
        cultivation.setLatitude(details.getLatitude());
        cultivation.setLongitude(details.getLongitude());
        cultivation.setNotes(details.getNotes());
        if (details.getStatus() != null) cultivation.setStatus(details.getStatus());
        return cultivationRepository.save(cultivation);
    }

    // ─── Batch ────────────────────────────────────────────────────────────────

    @Transactional
    public Batch createBatch(Long cultivationId, Batch batchDetails, Farmer farmer) {
        Cultivation cultivation = cultivationRepository.findByIdWithFarmer(cultivationId)
                .orElseThrow(() -> new RuntimeException("Cultivation not found with id: " + cultivationId));
        if (!cultivation.getFarmer().getId().equals(farmer.getId())) {
            throw new RuntimeException("You can only create a batch from your own cultivation.");
        }
        if (cultivation.getStatus() == CultivationStatus.HARVESTED ||
                batchRepository.findByFarmerId(farmer.getId()).stream()
                        .anyMatch(existing -> existing.getCultivation().getId().equals(cultivationId))) {
            throw new RuntimeException("A batch already exists for this cultivation.");
        }

        Batch batch = new Batch();
        batch.setCultivation(cultivation);

        // Generate unique batch number — use count + 1 with uniqueness guard
        long count = batchRepository.count() + 1;
        String batchNumber = "AYR-BATCH-" + String.format("%06d", count);
        while (batchRepository.findByBatchNumber(batchNumber).isPresent()) {
            count++;
            batchNumber = "AYR-BATCH-" + String.format("%06d", count);
        }
        batch.setBatchNumber(batchNumber);
        batch.setQuantity(batchDetails.getQuantity());
        batch.setQuantityUnit(batchDetails.getQuantityUnit());
        batch.setHarvestDate(batchDetails.getHarvestDate());
        batch.setLocation(batchDetails.getLocation());
        batch.setLatitude(batchDetails.getLatitude());
        batch.setLongitude(batchDetails.getLongitude());
        batch.setNotes(batchDetails.getNotes());
        batch.setQrCode("QR-" + batchNumber);
        batch.setStatus(BatchStatus.SUBMITTED);

        cultivation.setStatus(CultivationStatus.HARVESTED);
        cultivationRepository.save(cultivation);

        return batchRepository.save(batch);
    }

    /**
     * Returns all batches for a farmer using the JOIN FETCH repository method.
     * Avoids LazyInitializationException that occurred when iterating batchRepository.findAll().
     */
    @Transactional(readOnly = true)
    public List<Batch> getBatches(Farmer farmer) {
        return batchRepository.findByFarmerId(farmer.getId());
    }

    // ─── Profile ─────────────────────────────────────────────────────────────

    @Transactional
    public Farmer updateProfile(Farmer farmer, Farmer details) {
        farmer.setFullName(details.getFullName());
        farmer.setAddress(details.getAddress());
        farmer.setState(details.getState());
        farmer.setDistrict(details.getDistrict());
        farmer.setPincode(details.getPincode());
        return farmerRepository.save(farmer);
    }

    // ─── Messages ─────────────────────────────────────────────────────────────

    @Transactional
    public Message sendMessage(User sender, Long receiverId, String content) {
        String receiverRole = farmerRepository.existsById(receiverId) ? "ROLE_FARMER" : "ROLE_CUSTOMER";
        Message message = new Message();
        message.setSenderId(sender.getId());
        message.setSenderRole(sender.getRole().name());
        message.setReceiverId(receiverId);
        message.setReceiverRole(receiverRole);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());
        return messageRepository.save(message);
    }

    @Transactional(readOnly = true)
    public List<Message> getMessages(User user) {
        return messageRepository.findBySenderIdOrReceiverId(user.getId(), user.getId());
    }

    // ─── Notifications ────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<Notification> getNotifications(User user) {
        return notificationRepository.findByUserIdAndUserRoleOrderByTimestampDesc(
                user.getId(), "ROLE_FARMER");
    }

    /** Unread notification count — used for Flutter badge display. */
    @Transactional(readOnly = true)
    public long getUnreadNotificationCount(User user) {
        return notificationRepository.countByUserIdAndIsReadFalse(user.getId());
    }

    @Transactional
    public void markNotificationAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + notificationId));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllNotificationsRead(User user) {
        List<Notification> unread = notificationRepository
                .findByUserIdAndIsReadFalseOrderByTimestampDesc(user.getId());
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    // ─── Cultivation Requests ──────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<CultivationRequestResponse> getCultivationRequests(Farmer farmer) {
        return cultivationRequestRepository.findByFarmer(farmer).stream()
                .map(CultivationRequestResponse::from)
                .toList();
    }

    @Transactional
    public CultivationRequest updateRequestStatus(Long requestId, CultivationRequestStatus status) {
        CultivationRequest request = cultivationRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found: " + requestId));
        request.setStatus(status);
        return cultivationRequestRepository.save(request);
    }

    @Transactional(readOnly = true)
    public FarmerDashboardStats getDashboardStats(Farmer farmer) {
        long totalCultivations = cultivationRepository.countByFarmer(farmer);
        
        List<Batch> batches = batchRepository.findByFarmerId(farmer.getId());
        long activeBatches = batches.stream().filter(b -> b.getStatus() != BatchStatus.COMPLETED && b.getStatus() != BatchStatus.REJECTED).count();
        long completedBatches = batches.stream().filter(b -> b.getStatus() == BatchStatus.COMPLETED).count();
        
        long pendingRequests = cultivationRequestRepository.findByFarmer(farmer).stream()
                .filter(r -> r.getStatus() == CultivationRequestStatus.PENDING).count();
        
        long unreadNotifications = notificationRepository.countByUserIdAndIsReadFalse(farmer.getId());
        
        return new FarmerDashboardStats(totalCultivations, activeBatches, completedBatches, pendingRequests, unreadNotifications);
    }
}
