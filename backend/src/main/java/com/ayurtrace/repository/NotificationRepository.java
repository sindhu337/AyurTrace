package com.ayurtrace.repository;

import com.ayurtrace.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByTimestampDesc(Long userId);
    List<Notification> findByUserIdAndIsReadFalseOrderByTimestampDesc(Long userId);
    long countByUserIdAndIsReadFalse(Long userId);
    List<Notification> findByUserIdAndUserRoleOrderByTimestampDesc(Long userId, String userRole);
}
