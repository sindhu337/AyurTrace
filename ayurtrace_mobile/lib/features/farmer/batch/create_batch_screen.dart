import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../services/farmer_service.dart';
import '../../../models/cultivation.dart';
import '../../../core/theme/app_theme.dart';
import '../../auth/auth_provider.dart';
import 'package:intl/intl.dart';

class CreateBatchScreen extends StatefulWidget {
  const CreateBatchScreen({super.key});

  @override
  State<CreateBatchScreen> createState() => _CreateBatchScreenState();
}

class _CreateBatchScreenState extends State<CreateBatchScreen> {
  final _formKey = GlobalKey<FormState>();
  
  String? _selectedCultivationId;
  final _qtyController = TextEditingController();
  String _qtyUnit = 'kg';
  DateTime _harvestDate = DateTime.now();
  final _locationController = TextEditingController();
  final _gpsController = TextEditingController();
  final _notesController = TextEditingController();

  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    final farmerId = context.watch<AuthProvider>().userId ?? '';
    
    return Scaffold(
      appBar: AppBar(title: const Text('Create Batch')),
      body: FutureBuilder<List<Cultivation>>(
        future: context.read<FarmerService>().getCultivations(farmerId),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) return const Center(child: CircularProgressIndicator());
          final cultivations = (snapshot.data ?? []).where((c) => c.status != 'HARVESTED').toList();
          
          if (cultivations.isEmpty) return _buildEmptyState();

          return SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Select Cultivation', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                    value: _selectedCultivationId,
                    items: cultivations.map((c) => DropdownMenuItem<String>(value: c.id, child: Text(c.herbName))).toList(),
                    onChanged: (id) {
                      setState(() {
                        _selectedCultivationId = id;
                        final v = cultivations.firstWhere((c) => c.id == id);
                        _locationController.text = v.location;
                        _gpsController.text = '${v.latitude}, ${v.longitude}';
                        _qtyController.text = v.expectedQuantity.toString();
                        _qtyUnit = v.quantityUnit;
                      });
                    },
                    decoration: const InputDecoration(prefixIcon: Icon(Icons.grass)),
                    validator: (v) => v == null ? 'Please select a cultivation' : null,
                  ),
                  const Divider(height: 48),
                  const Text('Batch Details', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: TextFormField(
                          controller: _qtyController,
                          decoration: const InputDecoration(labelText: 'Harvested Quantity'),
                          keyboardType: TextInputType.number,
                          validator: (v) => v!.isEmpty ? 'Required' : null,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: DropdownButtonFormField<String>(
                          value: _qtyUnit,
                          items: ['kg', 'quintal', 'ton'].map((u) => DropdownMenuItem(value: u, child: Text(u))).toList(),
                          onChanged: (v) => setState(() => _qtyUnit = v!),
                          decoration: const InputDecoration(labelText: 'Unit'),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  ListTile(
                    title: Text('Harvest Date: ${DateFormat('dd/MM/yyyy').format(_harvestDate)}'),
                    trailing: const Icon(Icons.calendar_today),
                    onTap: () async {
                      final date = await showDatePicker(context: context, initialDate: _harvestDate, firstDate: DateTime(2020), lastDate: DateTime.now());
                      if (date != null) setState(() => _harvestDate = date);
                    },
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _locationController,
                    decoration: const InputDecoration(labelText: 'Location', prefixIcon: Icon(Icons.location_on)),
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _gpsController,
                    decoration: const InputDecoration(labelText: 'GPS (Lat, Long)', prefixIcon: Icon(Icons.gps_fixed)),
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _notesController,
                    maxLines: 3,
                    decoration: const InputDecoration(labelText: 'Notes'),
                  ),
                  const SizedBox(height: 40),
                  _isLoading
                      ? const Center(child: CircularProgressIndicator())
                      : ElevatedButton(
                          onPressed: _create,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.primaryColor,
                            minimumSize: const Size(double.infinity, 50),
                          ),
                          child: const Text('CREATE BATCH'),
                        ),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.grass, size: 64, color: Colors.grey),
          const SizedBox(height: 16),
          const Text('No active cultivations found.', style: TextStyle(fontSize: 16, color: Colors.grey)),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('GO BACK'),
          ),
        ],
      ),
    );
  }

  void _create() async {
    if (_formKey.currentState!.validate() && _selectedCultivationId != null) {
      setState(() => _isLoading = true);
      try {
        final data = {
          'quantity': double.tryParse(_qtyController.text) ?? 0,
          'quantityUnit': _qtyUnit,
          'harvestDate': _harvestDate.toIso8601String().split('T')[0],
          'location': _locationController.text,
          'latitude': _gpsController.text.contains(',') ? double.parse(_gpsController.text.split(',')[0].trim()) : 0,
          'longitude': _gpsController.text.contains(',') ? double.parse(_gpsController.text.split(',')[1].trim()) : 0,
          'notes': _notesController.text,
        };
        await context.read<FarmerService>().createBatch(_selectedCultivationId!, data);
        if (mounted) {
          _showSuccessDialog();
        }
      } catch (e) {
        if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
      } finally {
        if (mounted) setState(() => _isLoading = false);
      }
    }
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Icon(Icons.check_circle, color: Colors.green, size: 64),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Batch created successfully!', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            SizedBox(height: 8),
            Text('The batch has been added to your inventory.'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context); // Dialog
              Navigator.pop(context); // Screen
            },
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }
}
