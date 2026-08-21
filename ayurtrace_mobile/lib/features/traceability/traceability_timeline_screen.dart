import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

import 'package:provider/provider.dart';
import '../../services/traceability_service.dart';
import '../../models/traceability_response.dart';

class TraceabilityTimelineScreen extends StatelessWidget {
  final String batchId;
  const TraceabilityTimelineScreen({super.key, required this.batchId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Product Traceability')),
      body: FutureBuilder<TraceabilityResponse?>(
        future: context.read<TraceabilityService>().getProductHistory(batchId),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) return const Center(child: CircularProgressIndicator());
          final data = snapshot.data;
          if (data == null) return const Center(child: Text('No traceability data found.'));

          return SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Card(
                  child: ListTile(
                    leading: const Icon(Icons.qr_code, color: AppTheme.primaryColor),
                    title: Text('QR Code: ${data.qrId}'),
                    subtitle: Text('Scanned on: ${DateTime.now().toString().split(' ')[0]}'),
                  ),
                ),
                const SizedBox(height: 24),
                const Text(
                  'Product Journey',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 24),
                _buildTimelineStep(
                  'Cultivation',
                  'Farmer: ${data.farmerName ?? "N/A"}\nHerb: ${data.herbName ?? "N/A"}\nMethod: ${data.cultivationMethod ?? "N/A"}\nLocation: ${data.cultivationLocation ?? "N/A"}',
                  Icons.grass,
                  true,
                ),
                _buildTimelineStep(
                  'Harvesting',
                  'Batch: ${data.batchNumber ?? "N/A"}\nQuantity: ${data.batchQuantity} ${data.batchQuantityUnit}\nDate: ${data.harvestDate?.toString().split(' ')[0] ?? "N/A"}',
                  Icons.agriculture,
                  true,
                ),
                _buildTimelineStep(
                  'Processing',
                  'Manufacturer: ${data.manufacturerCompanyName ?? "N/A"}\nOwner: ${data.manufacturerOwnerName ?? "N/A"}\nLocation: ${data.manufacturerDistrict}, ${data.manufacturerState}',
                  Icons.factory,
                  true,
                ),
                _buildTimelineStep(
                  'Distribution',
                  'Product: ${data.productName ?? "N/A"}\nPrice: ₹${data.productPrice}\nExpiry: ${data.expiryDate?.toString().split(' ')[0] ?? "N/A"}',
                  Icons.local_shipping,
                  false,
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildTimelineStep(String title, String description, IconData icon, bool hasMore) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: const BoxDecoration(color: AppTheme.primaryColor, shape: BoxShape.circle),
              child: Icon(icon, color: Colors.white, size: 20),
            ),
            if (hasMore)
              Container(width: 2, height: 100, color: AppTheme.primaryColor.withValues(alpha: 0.3)),
          ],
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              const SizedBox(height: 4),
              Text(description, style: TextStyle(color: Colors.grey[700], fontSize: 14, height: 1.5)),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ],
    );
  }
}
