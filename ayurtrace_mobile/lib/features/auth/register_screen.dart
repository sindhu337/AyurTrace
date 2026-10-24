import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'auth_provider.dart';
import 'package:go_router/go_router.dart';
import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';
import '../../core/constants/india_states.dart';

class RegisterScreen extends StatefulWidget {
  final String role;
  const RegisterScreen({super.key, required this.role});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();

  // Common fields
  final _fullNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _mobileController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _addressController = TextEditingController();
  final _stateController = TextEditingController();
  final _districtController = TextEditingController();
  final _pincodeController = TextEditingController();

  // Farmer specific
  final _aadhaarController = TextEditingController();
  final _latitudeController = TextEditingController();
  final _longitudeController = TextEditingController();
  String _locationMode = 'Manual'; // 'GPS' or 'Manual'
  String? _selectedState;
  String? _selectedDistrict;

  // Customer specific
  final _usernameController = TextEditingController();
  String _gender = 'Male';
  DateTime _dob = DateTime.now();

  bool _isLoading = false;

  Future<void> _getCurrentLocation() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!mounted) return;
    if (!serviceEnabled) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Location services are disabled.')),
      );
      return;
    }

    permission = await Geolocator.checkPermission();
    if (!mounted) return;
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (!mounted) return;
      if (permission == LocationPermission.denied) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Location permissions are denied')),
        );
        return;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Location permissions are permanently denied.')),
      );
      return;
    }

    setState(() => _isLoading = true);
    try {
      Position position = await Geolocator.getCurrentPosition();
      if (!mounted) return;
      _latitudeController.text = position.latitude.toString();
      _longitudeController.text = position.longitude.toString();
      
      // The geocoding package does not provide a web implementation. GPS
      // coordinates are still valid there and the address can be entered
      // manually.
      if (!kIsWeb) {
        try {
          final placemarks = await placemarkFromCoordinates(
            position.latitude,
            position.longitude,
          );
          if (!mounted || placemarks.isEmpty) return;

          final place = placemarks.first;
          setState(() {
            _stateController.text = place.administrativeArea ?? '';
            _districtController.text =
                place.subAdministrativeArea ?? place.locality ?? '';
            _selectedState = place.administrativeArea;
            _selectedDistrict =
                place.subAdministrativeArea ?? place.locality;
          });
        } on PlatformException {
          // Reverse geocoding is optional; keep the detected coordinates.
        }
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error getting location: $e')),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _testConnection() async {
    setState(() => _isLoading = true);
    final result = await context.read<AuthProvider>().checkConnection();
    if (mounted) setState(() => _isLoading = false);

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(result ?? "Unknown error"),
          backgroundColor: result?.contains("reachable") == true ? Colors.green : Colors.red,
        ),
      );
    }
  }

  void _register() async {
    if (_formKey.currentState!.validate()) {
      if (_passwordController.text != _confirmPasswordController.text) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Passwords do not match')),
        );
        return;
      }

      setState(() => _isLoading = true);

      Map<String, dynamic> userData = {
        'fullName': _fullNameController.text,
        'email': _emailController.text,
        'mobile': _mobileController.text,
        'password': _passwordController.text,
        'address': _addressController.text,
        'state': _locationMode == 'GPS' ? _stateController.text : _selectedState,
        'district': _locationMode == 'GPS' ? _districtController.text : _selectedDistrict,
        'pincode': _pincodeController.text,
        'role': widget.role,
      };

      if (widget.role == 'FARMER') {
        userData.addAll({
          'aadharNo': _aadhaarController.text,
          'gpsCoordinates': _locationMode == 'GPS' 
              ? '${_latitudeController.text},${_longitudeController.text}'
              : null,
        });
      } else {
        userData.addAll({
          'username': _usernameController.text,
          'gender': _gender,
          'dob': _dob.toIso8601String().split('T')[0],
        });
      }

      final authProvider = context.read<AuthProvider>();
      final success = await authProvider.register(userData);
      if (!mounted) return;
      setState(() => _isLoading = false);

      if (success) {
        String msg = widget.role == 'FARMER'
            ? 'Registration successful! Waiting for admin approval.'
            : 'Registration successful. Please login.';
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
        context.pop();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(authProvider.errorMessage ?? 'Registration failed.')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${widget.role} Register'),
        actions: [
          IconButton(
            icon: const Icon(Icons.network_check),
            onPressed: _testConnection,
            tooltip: 'Test Connection to Server',
          ),
        ],
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
        padding: const EdgeInsets.all(24.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              if (widget.role == 'CUSTOMER') ...[
                TextFormField(
                  controller: _usernameController,
                  decoration: const InputDecoration(labelText: 'Username', prefixIcon: Icon(Icons.person_outline)),
                  validator: (value) => value!.isEmpty ? 'Enter username' : null,
                ),
                const SizedBox(height: 16),
              ],
              TextFormField(
                controller: _fullNameController,
                decoration: const InputDecoration(labelText: 'Full Name', prefixIcon: Icon(Icons.person)),
                validator: (value) => value!.isEmpty ? 'Enter full name' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _emailController,
                decoration: const InputDecoration(labelText: 'Email', prefixIcon: Icon(Icons.email)),
                validator: (value) {
                  if (value == null || value.isEmpty) return 'Enter email';
                  if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value)) return 'Enter valid email';
                  return null;
                },
                keyboardType: TextInputType.emailAddress,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _mobileController,
                decoration: const InputDecoration(labelText: 'Mobile Number', prefixIcon: Icon(Icons.phone)),
                validator: (value) {
                  if (value == null || value.isEmpty) return 'Enter mobile number';
                  if (!RegExp(r'^[0-9]{10}$').hasMatch(value)) return 'Enter valid 10-digit number';
                  return null;
                },
                keyboardType: TextInputType.phone,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _passwordController,
                obscureText: true,
                decoration: const InputDecoration(labelText: 'Password', prefixIcon: Icon(Icons.lock)),
                validator: (value) => value!.isEmpty ? 'Enter password' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _confirmPasswordController,
                obscureText: true,
                decoration: const InputDecoration(labelText: 'Confirm Password', prefixIcon: Icon(Icons.lock_reset)),
                validator: (value) => value!.isEmpty ? 'Confirm your password' : null,
              ),
              const SizedBox(height: 16),
              if (widget.role == 'FARMER') ...[
                TextFormField(
                  controller: _aadhaarController,
                  decoration: const InputDecoration(labelText: 'Aadhaar Number', prefixIcon: Icon(Icons.fingerprint)),
                  validator: (value) => value!.length != 12 ? 'Enter 12-digit Aadhaar' : null,
                  keyboardType: TextInputType.number,
                ),
              ],
              if (widget.role == 'CUSTOMER') ...[
                DropdownButtonFormField<String>(
                  value: _gender,
                  decoration: const InputDecoration(labelText: 'Gender', prefixIcon: Icon(Icons.people)),
                  items: ['Male', 'Female', 'Other'].map((g) => DropdownMenuItem(value: g, child: Text(g))).toList(),
                  onChanged: (val) => setState(() => _gender = val!),
                ),
                const SizedBox(height: 16),
                ListTile(
                  title: Text("Date of Birth: ${_dob.toLocal()}".split(' ')[0]),
                  trailing: const Icon(Icons.calendar_today),
                  onTap: () async {
                    final date = await showDatePicker(
                      context: context,
                      initialDate: _dob,
                      firstDate: DateTime(1900),
                      lastDate: DateTime.now(),
                    );
                    if (date != null) setState(() => _dob = date);
                  },
                ),
                const SizedBox(height: 16),
              ],
              const Text('LOCATION', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.green)),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: RadioListTile<String>(
                      title: const Text('GPS', style: TextStyle(fontSize: 12)),
                      value: 'GPS',
                      groupValue: _locationMode,
                      onChanged: (val) => setState(() => _locationMode = val!),
                    ),
                  ),
                  Expanded(
                    child: RadioListTile<String>(
                      title: const Text('Manual', style: TextStyle(fontSize: 12)),
                      value: 'Manual',
                      groupValue: _locationMode,
                      onChanged: (val) => setState(() => _locationMode = val!),
                    ),
                  ),
                ],
              ),
              if (_locationMode == 'GPS') ...[
                ElevatedButton.icon(
                  onPressed: _isLoading ? null : _getCurrentLocation,
                  icon: const Icon(Icons.my_location),
                  label: const Text('DETECT CURRENT LOCATION'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green.shade50,
                    foregroundColor: Colors.green,
                  ),
                ),
                const SizedBox(height: 16),
                if (_latitudeController.text.isNotEmpty)
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(color: Colors.green.shade50, borderRadius: BorderRadius.circular(8)),
                    child: Text('📍 ${_districtController.text}, ${_stateController.text}\nLat: ${_latitudeController.text}, Lng: ${_longitudeController.text}',
                        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
                  ),
              ] else ...[
                DropdownButtonFormField<String>(
                  value: _selectedState,
                  decoration: const InputDecoration(labelText: 'Select State'),
                  items: indiaStates.keys.map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
                  onChanged: (val) {
                    setState(() {
                      _selectedState = val;
                      _selectedDistrict = null;
                    });
                  },
                ),
                const SizedBox(height: 16),
                if (_selectedState != null)
                  DropdownButtonFormField<String>(
                    value: _selectedDistrict,
                    decoration: const InputDecoration(labelText: 'Select District'),
                    items: indiaStates[_selectedState!]!.map((d) => DropdownMenuItem(value: d, child: Text(d))).toList(),
                    onChanged: (val) => setState(() => _selectedDistrict = val),
                  ),
              ],
              const SizedBox(height: 16),
              TextFormField(
                controller: _addressController,
                decoration: const InputDecoration(labelText: 'Detailed Address', prefixIcon: Icon(Icons.home)),
                validator: (value) => value!.isEmpty ? 'Enter address' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _pincodeController,
                decoration: const InputDecoration(labelText: 'Pincode', prefixIcon: Icon(Icons.location_on)),
                validator: (value) => value!.isEmpty ? 'Enter pincode' : null,
                keyboardType: TextInputType.number,
              ),
              const SizedBox(height: 40),
              _isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : ElevatedButton(
                      onPressed: _register,
                      child: const Text('REGISTER'),
                    ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}
