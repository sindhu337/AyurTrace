import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../services/farmer_service.dart';
import 'package:intl/intl.dart';

class CultivationRequestsScreen extends StatefulWidget {
  const CultivationRequestsScreen({super.key});

  @override
  State<CultivationRequestsScreen> createState() => _CultivationRequestsScreenState();
}

class _CultivationRequestsScreenState extends State<CultivationRequestsScreen> {
  bool _isLoading = true;
  List<dynamic> _requests = [];

  @override
  void initState() {
    super.initState();
    _fetchRequests();
  }

  Future<void> _fetchRequests() async {
    try {
      final response = await Provider.of<FarmerService>(context, listen: false).getCultivationRequests();
      setState(() {
        _requests = response;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Manufacturer Interest')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _requests.isEmpty
              ? _buildEmptyState()
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _requests.length,
                  itemBuilder: (context, index) {
                    final req = _requests[index];
                    return _buildRequestCard(req);
                  },
                ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.request_page_outlined, size: 80, color: Colors.grey.shade300),
          const SizedBox(height: 16),
          const Text('No manufacturer requests yet.', style: TextStyle(color: Colors.grey)),
        ],
      ),
    );
  }

  Widget _buildRequestCard(dynamic req) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const CircleAvatar(backgroundColor: Colors.orange, child: Icon(Icons.business, color: Colors.white)),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(req['manufacturerName'] ?? 'Manufacturer', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      Text(req['herbName'] ?? 'Herb', style: const TextStyle(color: Colors.grey, fontSize: 13)),
                    ],
                  ),
                ),
                _buildStatusChip(req['status']),
              ],
            ),
            const Divider(height: 24),
            Text(req['message'] ?? 'Interested in your cultivation.', style: const TextStyle(fontSize: 14)),
            const SizedBox(height: 12),
            Row(
              children: [
                const Icon(Icons.currency_rupee, size: 16, color: Colors.green),
                Text('Offer: ₹${req['offeredPrice']}/kg', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.green)),
                const Spacer(),
                Text(DateFormat('dd MMM yyyy').format(DateTime.parse(req['createdAt'])), style: const TextStyle(color: Colors.grey, fontSize: 12)),
              ],
            ),
            if (req['status'] == 'PENDING') ...[
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => _updateStatus(req['id'], 'REJECTED'),
                      style: OutlinedButton.styleFrom(foregroundColor: Colors.red),
                      child: const Text('REJECT'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => _updateStatus(req['id'], 'ACCEPTED'),
                      style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
                      child: const Text('ACCEPT'),
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildStatusChip(String status) {
    Color color = Colors.grey;
    if (status == 'ACCEPTED') color = Colors.green;
    if (status == 'REJECTED') color = Colors.red;
    if (status == 'PENDING') color = Colors.orange;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)),
      child: Text(status, style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold)),
    );
  }

  Future<void> _updateStatus(int id, String status) async {
    setState(() => _isLoading = true);
    try {
      await Provider.of<FarmerService>(context, listen: false).updateRequestStatus(id, status);
      await _fetchRequests();
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Request $status')));
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
    }
  }
}
