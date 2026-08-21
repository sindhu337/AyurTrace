import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'auth_provider.dart';
import '../../core/theme/app_theme.dart';
import 'package:go_router/go_router.dart';

class LoginScreen extends StatefulWidget {
  final String role;
  const LoginScreen({super.key, required this.role});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _identifierController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;

  void _login() async {
    if (_formKey.currentState!.validate()) {
      setState(() => _isLoading = true);
      final authProvider = context.read<AuthProvider>();
      final success = await authProvider.login(
        _identifierController.text,
        _passwordController.text,
        widget.role,
      );
      if (!mounted) return;
      setState(() => _isLoading = false);

      if (success) {
        if (widget.role == 'FARMER') {
          context.go('/farmer-dashboard');
        } else {
          context.go('/customer-dashboard');
        }
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(authProvider.errorMessage ?? 'Login failed. Please check your credentials.')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    String label = widget.role == 'FARMER' ? 'Farmer ID' : 'Mobile Number';
    IconData icon = widget.role == 'FARMER' ? Icons.badge : Icons.phone;

    return Scaffold(
      appBar: AppBar(title: Text('${widget.role} Login')),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
        padding: const EdgeInsets.all(24.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 40),
              Icon(
                widget.role == 'FARMER' ? Icons.agriculture : Icons.person,
                size: 80,
                color: AppTheme.primaryColor,
              ),
              const SizedBox(height: 40),
              TextFormField(
                controller: _identifierController,
                decoration: InputDecoration(
                  labelText: label,
                  prefixIcon: Icon(icon),
                ),
                validator: (value) => value!.isEmpty ? 'Enter $label' : null,
                keyboardType: widget.role == 'CUSTOMER' ? TextInputType.phone : TextInputType.text,
              ),
              const SizedBox(height: 20),
              TextFormField(
                controller: _passwordController,
                obscureText: true,
                decoration: const InputDecoration(
                  labelText: 'Password',
                  prefixIcon: Icon(Icons.lock),
                ),
                validator: (value) => value!.isEmpty ? 'Enter password' : null,
              ),
              const SizedBox(height: 40),
              _isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : ElevatedButton(
                      onPressed: _login,
                      child: const Text('LOGIN'),
                    ),
              const SizedBox(height: 20),
              TextButton(
                onPressed: () => context.push('/register?role=${widget.role}'),
                child: const Text('Don\'t have an account? Register'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
