import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../services/customer_service.dart';
import '../../../core/theme/app_theme.dart';
import '../../auth/auth_provider.dart';
import 'package:intl/intl.dart';
import 'package:go_router/go_router.dart';

class CustomerProfileScreen extends StatefulWidget {
  const CustomerProfileScreen({super.key});

  @override
  State<CustomerProfileScreen> createState() => _CustomerProfileScreenState();
}

class _CustomerProfileScreenState extends State<CustomerProfileScreen> {
  Map<String, dynamic>? _profile;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchProfile();
  }

  void _fetchProfile() async {
    try {
      final data = await context.read<CustomerService>().getProfile();
      setState(() {
        _profile = data;
        _isLoading = false;
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error fetching profile: $e')));
      }
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) return const Center(child: CircularProgressIndicator());
    if (_profile == null) return const Center(child: Text('Profile not found'));

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          const CircleAvatar(
            radius: 50,
            backgroundColor: AppTheme.primaryColor,
            child: Icon(Icons.person, size: 50, color: Colors.white),
          ),
          const SizedBox(height: 24),
          _buildInfoTile('Full Name', _profile!['fullName']),
          _buildInfoTile('Email', _profile!['email']),
          _buildInfoTile('Mobile', _profile!['mobile']),
          _buildInfoTile('Gender', _profile!['gender']),
          _buildInfoTile('Date of Birth', _formatDate(_profile!['dob'])),
          const Divider(height: 48),
          _buildInfoTile('Address', _profile!['address']),
          Row(
            children: [
              Expanded(child: _buildInfoTile('State', _profile!['state'])),
              const SizedBox(width: 16),
              Expanded(child: _buildInfoTile('District', _profile!['district'])),
            ],
          ),
          _buildInfoTile('Pincode', _profile!['pincode']),
          const SizedBox(height: 40),
          ElevatedButton.icon(
            onPressed: () {
              context.read<AuthProvider>().logout();
              context.go('/');
            },
            icon: const Icon(Icons.logout),
            label: const Text('LOGOUT'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red.shade50,
              foregroundColor: Colors.red,
              minimumSize: const Size(double.infinity, 50),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoTile(String label, dynamic value) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(color: Colors.grey, fontSize: 12)),
          const SizedBox(height: 4),
          Text(
            value?.toString() ?? '—',
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }

  String _formatDate(String? dateStr) {
    if (dateStr == null) return '—';
    try {
      final date = DateTime.parse(dateStr);
      return DateFormat('dd MMM yyyy').format(date);
    } catch (e) {
      return dateStr;
    }
  }
}
