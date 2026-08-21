package com.ayurtrace.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ManufacturerDashboardStats {
    private long totalProducts;
    private long totalBatches;
    private long batchesReceived;
    private long ordersReceived;
    private long ordersPending;
    private long productsSold;
    private long qrCodesGenerated;
    private long assignedFarmers;
}
