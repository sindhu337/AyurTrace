package com.ayurtrace.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardStats {
    private long totalFarmers;
    private long pendingFarmers;
    private long activeFarmers;
    private long rejectedFarmers;
    private long totalManufacturers;
    private long pendingManufacturers;
    private long approvedManufacturers;
    private long rejectedManufacturers;
    private long totalBatches;
    private long totalProducts;
    private long totalOrders;
}
