package com.ayurtrace.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FarmerDashboardStats {
    private long totalCultivations;
    private long activeBatches;
    private long completedBatches;
    private long pendingRequests;
    private long unreadNotifications;
}
