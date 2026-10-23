import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';

import 'package:go_router/go_router.dart';

class RoleSelectionScreen extends StatefulWidget {
  const RoleSelectionScreen({super.key});

  @override
  State<RoleSelectionScreen> createState() => _RoleSelectionScreenState();
}

class _RoleSelectionScreenState extends State<RoleSelectionScreen> {
  String? _selectedAction;
  String _selectedRole = 'FARMER';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [AppTheme.primaryColor, AppTheme.backgroundColor],
          ),
        ),
        child: Center(
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(
              parent: AlwaysScrollableScrollPhysics(),
            ),
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (_selectedAction != null)
                    Transform.translate(
                      offset: const Offset(0, -8),
                      child: Align(
                        alignment: Alignment.centerLeft,
                        child: IconButton(
                          onPressed: () =>
                              setState(() => _selectedAction = null),
                          icon: const Icon(Icons.arrow_back),
                          color: Colors.white,
                          tooltip: 'Back',
                        ),
                      ),
                    ),
                  const Icon(Icons.eco, size: 100, color: Colors.white),
                  const SizedBox(height: 24),
                  const Text(
                    'AYURTRACE',
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      letterSpacing: 2,
                    ),
                  ),
                  const Text(
                    'Trace the Purity of Ayurveda',
                    style: TextStyle(fontSize: 16, color: Colors.white70),
                  ),
                  const SizedBox(height: 60),
                  if (_selectedAction == null) ...[
                    _buildActionCard(
                      title: 'Login',
                      subtitle: 'Access your AYURTRACE account',
                      icon: Icons.login,
                      action: 'login',
                    ),
                    const SizedBox(height: 20),
                    _buildActionCard(
                      title: 'Register',
                      subtitle: 'Create a new AYURTRACE account',
                      icon: Icons.person_add_alt_1,
                      action: 'register',
                    ),
                  ] else
                    _buildRoleSelector(context),
                  const SizedBox(height: 40),
                  TextButton(
                    onPressed: () => context.push('/trace'),
                    child: const Text(
                      'Quick Trace with QR',
                      style: TextStyle(
                        color: AppTheme.primaryColor,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildActionCard({
    required String title,
    required String subtitle,
    required IconData icon,
    required String action,
  }) {
    return InkWell(
      borderRadius: BorderRadius.circular(20),
      onTap: () {
        setState(() {
          _selectedAction = action;
          _selectedRole = 'FARMER';
        });
      },
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.1),
              blurRadius: 10,
              offset: const Offset(0, 5),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppTheme.primaryColor.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, size: 32, color: AppTheme.primaryColor),
            ),
            const SizedBox(width: 20),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    subtitle,
                    style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                  ),
                ],
              ),
            ),
            Icon(
              _selectedAction == action
                  ? Icons.keyboard_arrow_up
                  : Icons.arrow_forward_ios,
              size: 20,
              color: Colors.grey,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRoleSelector(BuildContext context) {
    final isLogin = _selectedAction == 'login';
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.94),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            isLogin ? 'Login as' : 'Register as',
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.primaryColor,
            ),
          ),
          const SizedBox(height: 16),
          SegmentedButton<String>(
            segments: const [
              ButtonSegment(
                value: 'FARMER',
                label: Text('Farmer'),
                icon: Icon(Icons.agriculture),
              ),
              ButtonSegment(
                value: 'CUSTOMER',
                label: Text('Customer'),
                icon: Icon(Icons.shopping_basket),
              ),
            ],
            selected: {_selectedRole},
            onSelectionChanged: (selection) {
              setState(() => _selectedRole = selection.first);
            },
            style: ButtonStyle(
              foregroundColor: WidgetStateProperty.all(AppTheme.primaryColor),
              side: WidgetStateProperty.all(
                BorderSide(color: AppTheme.primaryColor.withValues(alpha: 0.3)),
              ),
            ),
          ),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () {
              final path = isLogin ? '/login' : '/register';
              context.push('$path?role=$_selectedRole');
            },
            child: Text(isLogin ? 'Continue to Login' : 'Continue to Register'),
          ),
        ],
      ),
    );
  }
}
