import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../services/farmer_service.dart';
import '../../../models/batch.dart';
import '../../auth/auth_provider.dart';
import 'package:intl/intl.dart';

class MyBatchesScreen extends StatelessWidget {
  const MyBatchesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final farmerId = context.watch<AuthProvider>().userId ?? '';
    return Scaffold(
      appBar: AppBar(title: const Text('My Batches')),
      body: FutureBuilder<List<Batch>>(
        future: context.read<FarmerService>().getBatches(farmerId),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) return const Center(child: CircularProgressIndicator());
          final items = snapshot.data ?? [];
          if (items.isEmpty) return const Center(child: Text('No batches found.'));

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: items.length,
            itemBuilder: (context, index) {
              final item = items[index];
              return Card(
                elevation: 2,
                margin: const EdgeInsets.only(bottom: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: ExpansionTile(
                  leading: const Icon(Icons.inventory, color: Colors.blue),
                  title: Text(item.batchNumber, style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text('Harvested: ${DateFormat('dd MMM yyyy').format(item.harvestDate)}'),
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _buildDetailRow('Quantity', '${item.quantity} ${item.quantityUnit}'),
                          _buildDetailRow('Location', item.location),
                          _buildDetailRow('GPS', '${item.latitude}, ${item.longitude}'),
                          _buildDetailRow('Status', item.status),
                          _buildDetailRow('QR Code', item.qrCode),
                          if (item.notes.isNotEmpty) _buildDetailRow('Notes', item.notes),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.grey)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
