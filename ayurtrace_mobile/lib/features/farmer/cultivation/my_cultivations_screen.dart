import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../services/farmer_service.dart';
import '../../../models/cultivation.dart';
import '../../../core/theme/app_theme.dart';
import '../../auth/auth_provider.dart';
import 'package:intl/intl.dart';
import 'package:go_router/go_router.dart';

class MyCultivationsScreen extends StatelessWidget {
  const MyCultivationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final farmerId = context.watch<AuthProvider>().userId ?? '';
    return Scaffold(
      appBar: AppBar(title: const Text('My Cultivations')),
      body: FutureBuilder<List<Cultivation>>(
        future: context.read<FarmerService>().getCultivations(farmerId),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) return const Center(child: CircularProgressIndicator());
          final items = snapshot.data ?? [];
          if (items.isEmpty) return const Center(child: Text('No cultivations found.'));

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: items.length,
            itemBuilder: (context, index) {
              final item = items[index];
              return Card(
                elevation: 2,
                margin: const EdgeInsets.only(bottom: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            '🌿 ${item.herbName}',
                            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                          _buildStatusBadge(item.status),
                        ],
                      ),
                      const Divider(height: 24),
                      _buildInfoRow(Icons.straighten, 'Area', '${item.area} ${item.areaUnit}'),
                      _buildInfoRow(Icons.inventory_2, 'Expected Qty', '${item.expectedQuantity} ${item.quantityUnit}'),
                      _buildInfoRow(Icons.payments, 'Price', '₹${item.price}/${item.quantityUnit}'),
                      _buildInfoRow(Icons.calendar_today, 'Planting Date', DateFormat('dd MMM yyyy').format(item.plantingDate)),
                      _buildInfoRow(Icons.event_available, 'Exp. Harvest', DateFormat('dd MMM yyyy').format(item.expectedHarvestDate)),
                      _buildInfoRow(Icons.location_on, 'Location', item.location),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push('/farmer/cultivation/add'),
        backgroundColor: AppTheme.primaryColor,
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    Color color = Colors.green;
    if (status == 'HARVESTED') color = Colors.orange;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)),
      child: Text(status, style: TextStyle(color: color, fontSize: 12, fontWeight: FontWeight.bold)),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Icon(icon, size: 16, color: Colors.grey),
          const SizedBox(width: 8),
          Text('$label:', style: const TextStyle(color: Colors.grey, fontSize: 14)),
          const SizedBox(width: 8),
          Expanded(child: Text(value, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500))),
        ],
      ),
    );
  }
}
