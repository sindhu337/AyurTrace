import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../services/farmer_service.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/config/api_config.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _isEditing = false;
  Map<String, dynamic>? _profile;
  bool _isLoading = true;

  final _fullNameController = TextEditingController();
  final _addressController = TextEditingController();
  final _stateController = TextEditingController();
  final _districtController = TextEditingController();
  final _pincodeController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _fetchProfile();
  }

  void _fetchProfile() async {
    try {
      final data = await context.read<FarmerService>().getProfile();
      setState(() {
        _profile = data;
        _fullNameController.text = data['fullName'] ?? '';
        _addressController.text = data['address'] ?? '';
        _stateController.text = data['state'] ?? '';
        _districtController.text = data['district'] ?? '';
        _pincodeController.text = data['pincode'] ?? '';
        _isLoading = false;
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) return const Scaffold(body: Center(child: CircularProgressIndicator()));
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Manage Profile'),
        actions: [
          IconButton(
            icon: Icon(_isEditing ? Icons.save : Icons.edit),
            onPressed: () {
              if (_isEditing) {
                _saveProfile();
              } else {
                setState(() => _isEditing = true);
              }
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            const CircleAvatar(
              radius: 50,
              backgroundColor: AppTheme.primaryColor,
              child: Icon(Icons.person, size: 50, color: Colors.white),
            ),
            const SizedBox(height: 24),
            _buildInfoCard('Farmer ID', _profile?['farmerId'] ?? 'N/A', isReadOnly: true),
            _buildEditableCard('Full Name', _fullNameController),
            _buildInfoCard('Email', _profile?['email'] ?? 'N/A', isReadOnly: true),
            _buildInfoCard('Mobile', _profile?['mobile'] ?? 'N/A', isReadOnly: true),
            _buildEditableCard('Address', _addressController),
            Row(
              children: [
                Expanded(child: _buildEditableCard('State', _stateController)),
                const SizedBox(width: 16),
                Expanded(child: _buildEditableCard('District', _districtController)),
              ],
            ),
            _buildEditableCard('Pincode', _pincodeController),
            const SizedBox(height: 24),
            _buildSectionHeader('Documents'),
            _buildDocumentTile('RTC Document', _profile?['rtcDocument']),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Align(
        alignment: Alignment.centerLeft,
        child: Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.primaryColor)),
      ),
    );
  }

  Widget _buildDocumentTile(String label, String? path) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(12)),
      child: Row(
        children: [
          const Icon(Icons.description, color: Colors.green),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                if (path != null)
                  Text(path.split('/').last, style: const TextStyle(fontSize: 12, color: Colors.grey), overflow: TextOverflow.ellipsis),
              ],
            ),
          ),
          if (path != null)
            IconButton(
              icon: const Icon(Icons.open_in_new, color: Colors.blue),
              onPressed: () {
                // Future: Open document URL in browser or viewer
                final url = '${ApiConfig.baseUrl}$path';
                debugPrint("Opening document: $url");
              },
            ),
        ],
      ),
    );
  }

  Widget _buildInfoCard(String label, String value, {bool isReadOnly = false}) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(12)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(color: Colors.grey, fontSize: 12)),
          const SizedBox(height: 4),
          Text(value, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildEditableCard(String label, TextEditingController controller) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: TextField(
        controller: controller,
        enabled: _isEditing,
        decoration: InputDecoration(
          labelText: label,
          filled: !_isEditing,
          fillColor: _isEditing ? Colors.white : Colors.grey.shade100,
        ),
      ),
    );
  }

  void _saveProfile() async {
    setState(() => _isLoading = true);
    try {
      final data = {
        'fullName': _fullNameController.text,
        'address': _addressController.text,
        'state': _stateController.text,
        'district': _districtController.text,
        'pincode': _pincodeController.text,
      };
      await context.read<FarmerService>().updateProfile(data);
      setState(() {
        _isEditing = false;
        _isLoading = false;
      });
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Profile updated successfully')));
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
      setState(() => _isLoading = false);
    }
  }
}
