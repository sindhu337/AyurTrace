import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../services/farmer_service.dart';
import '../../../core/theme/app_theme.dart';
import 'package:intl/intl.dart';

class AddCultivationScreen extends StatefulWidget {
  const AddCultivationScreen({super.key});

  @override
  State<AddCultivationScreen> createState() => _AddCultivationScreenState();
}

class _AddCultivationScreenState extends State<AddCultivationScreen> {
  final _formKey = GlobalKey<FormState>();
  
  final _herbNameController = TextEditingController();
  final _areaController = TextEditingController();
  String _areaUnit = 'Acres';
  String _method = 'Organic';
  DateTime _plantingDate = DateTime.now();
  DateTime _harvestDate = DateTime.now().add(const Duration(days: 90));
  final _qtyController = TextEditingController();
  String _qtyUnit = 'kg';
  final _priceController = TextEditingController();
  final _locationController = TextEditingController();
  final _gpsController = TextEditingController();
  final _notesController = TextEditingController();

  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _prefillLocation();
  }

  Future<void> _prefillLocation() async {
    try {
      final profile = await context.read<FarmerService>().getProfile();
      if (profile.containsKey('address')) {
        setState(() {
          _locationController.text = profile['address'] ?? '';
          if (profile['latitude'] != null && profile['longitude'] != null) {
            _gpsController.text = '${profile['latitude']}, ${profile['longitude']}';
          }
        });
      }
    } catch (e) {
      debugPrint("Prefill Error: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Add Cultivation')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildSectionTitle('Basic Info'),
              TextFormField(
                controller: _herbNameController,
                decoration: const InputDecoration(labelText: 'Herb Name', prefixIcon: Icon(Icons.grass)),
                validator: (v) => v!.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _areaController,
                      decoration: const InputDecoration(labelText: 'Area'),
                      keyboardType: TextInputType.number,
                      validator: (v) => v!.isEmpty ? 'Required' : null,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: DropdownButtonFormField<String>(
                      value: _areaUnit,
                      items: ['Acres', 'Hectares', 'Gunta'].map((u) => DropdownMenuItem(value: u, child: Text(u))).toList(),
                      onChanged: (v) => setState(() => _areaUnit = v!),
                      decoration: const InputDecoration(labelText: 'Unit'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _method,
                items: ['Organic', 'Natural', 'Conventional'].map((m) => DropdownMenuItem(value: m, child: Text(m))).toList(),
                onChanged: (v) => setState(() => _method = v!),
                decoration: const InputDecoration(labelText: 'Cultivation Method', prefixIcon: Icon(Icons.category)),
              ),
              const SizedBox(height: 24),
              _buildSectionTitle('Dates'),
              ListTile(
                title: Text('Planting Date: ${DateFormat('dd/MM/yyyy').format(_plantingDate)}'),
                trailing: const Icon(Icons.calendar_today),
                onTap: () async {
                  final date = await showDatePicker(context: context, initialDate: _plantingDate, firstDate: DateTime(2020), lastDate: DateTime(2030));
                  if (date != null) setState(() => _plantingDate = date);
                },
              ),
              ListTile(
                title: Text('Expected Harvest: ${DateFormat('dd/MM/yyyy').format(_harvestDate)}'),
                trailing: const Icon(Icons.calendar_today),
                onTap: () async {
                  final date = await showDatePicker(context: context, initialDate: _harvestDate, firstDate: _plantingDate, lastDate: DateTime(2030));
                  if (date != null) setState(() => _harvestDate = date);
                },
              ),
              const SizedBox(height: 24),
              _buildSectionTitle('Output & Price'),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _qtyController,
                      decoration: const InputDecoration(labelText: 'Expected Qty'),
                      keyboardType: TextInputType.number,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: DropdownButtonFormField<String>(
                      value: _qtyUnit,
                      items: ['kg', 'quintal', 'ton'].map((u) => DropdownMenuItem(value: u, child: Text(u))).toList(),
                      onChanged: (v) => setState(() => _qtyUnit = v!),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _priceController,
                decoration: const InputDecoration(labelText: 'Price per Unit (₹)', prefixIcon: Icon(Icons.currency_rupee)),
                keyboardType: TextInputType.number,
              ),
              const SizedBox(height: 24),
              _buildSectionTitle('Location'),
              TextFormField(
                controller: _locationController,
                decoration: const InputDecoration(labelText: 'Location Name', prefixIcon: Icon(Icons.location_on)),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _gpsController,
                decoration: const InputDecoration(
                  labelText: 'GPS Coordinates (Lat, Long)',
                  prefixIcon: Icon(Icons.gps_fixed),
                  hintText: '12.2958, 76.6394',
                ),
              ),
              const SizedBox(height: 24),
              _buildSectionTitle('Notes'),
              TextFormField(
                controller: _notesController,
                maxLines: 3,
                decoration: const InputDecoration(labelText: 'Additional Notes', alignLabelWithHint: true),
              ),
              const SizedBox(height: 40),
              _isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : ElevatedButton(
                      onPressed: _save,
                      style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 50)),
                      child: const Text('SAVE CULTIVATION'),
                    ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.primaryColor)),
    );
  }

  void _save() async {
    if (_formKey.currentState!.validate()) {
      setState(() => _isLoading = true);
      try {
        final data = {
          'herbName': _herbNameController.text,
          'area': _areaController.text,
          'areaUnit': _areaUnit,
          'cultivationMethod': _method,
          'plantingDate': _plantingDate.toIso8601String().split('T')[0],
          'expectedHarvestDate': _harvestDate.toIso8601String().split('T')[0],
          'expectedQuantity': double.tryParse(_qtyController.text) ?? 0,
          'quantityUnit': _qtyUnit,
          'price': double.tryParse(_priceController.text) ?? 0,
          'location': _locationController.text,
          'latitude': _gpsController.text.contains(',') ? double.parse(_gpsController.text.split(',')[0].trim()) : 0,
          'longitude': _gpsController.text.contains(',') ? double.parse(_gpsController.text.split(',')[1].trim()) : 0,
          'notes': _notesController.text,
          'status': 'GROWING',
        };
        await context.read<FarmerService>().addCultivation(data);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Cultivation details added successfully')));
          Navigator.pop(context);
        }
      } catch (e) {
        if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
      } finally {
        if (mounted) setState(() => _isLoading = false);
      }
    }
  }
}
