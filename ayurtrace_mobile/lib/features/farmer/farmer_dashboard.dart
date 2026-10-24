import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../core/theme/app_theme.dart';
import '../../services/farmer_service.dart';
import '../auth/auth_provider.dart';

class FarmerDashboard extends StatefulWidget {
  const FarmerDashboard({super.key});

  @override
  State<FarmerDashboard> createState() => _FarmerDashboardState();
}

class _FarmerDashboardState extends State<FarmerDashboard> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<FarmerService>().fetchDashboardStats();
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final farmerService = context.watch<FarmerService>();
    final stats = farmerService.stats;

    return Scaffold(
      backgroundColor: const Color(0xFFF4F8F0),
      body: SafeArea(
        bottom: false,
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(
            parent: AlwaysScrollableScrollPhysics(),
          ),
          child: Column(
            children: [
              _buildHeader(context, auth, stats),
              _buildFeatureGrid(context),
              _buildLogoutButton(context),
              const SizedBox(height: 28),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(
    BuildContext context,
    AuthProvider auth,
    Map<String, dynamic>? stats,
  ) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(20, 18, 20, 22),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFF0E563B),
            AppTheme.primaryColor,
            Color(0xFF4C8A4A),
          ],
        ),
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(34),
          bottomRight: Radius.circular(34),
        ),
      ),
      child: Stack(
        children: [
          Positioned(
            top: -34,
            right: -18,
            child: Icon(
              Icons.eco,
              size: 148,
              color: Colors.white.withValues(alpha: 0.07),
            ),
          ),
          Positioned(
            bottom: 58,
            left: -30,
            child: Icon(
              Icons.grass,
              size: 105,
              color: Colors.white.withValues(alpha: 0.06),
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    width: 42,
                    height: 42,
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.16),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: Colors.white.withValues(alpha: 0.22),
                      ),
                    ),
                    child: const Icon(
                      Icons.eco_outlined,
                      color: Color(0xFFD7F2B5),
                      size: 27,
                    ),
                  ),
                  const SizedBox(width: 11),
                  const Expanded(
                    child: Text(
                      'AYURTRACE Farmer',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 0.2,
                      ),
                    ),
                  ),
                  _buildHeaderIcon(
                    icon: Icons.notifications_none_rounded,
                    onTap: () => context.push('/farmer/notifications'),
                  ),
                  const SizedBox(width: 8),
                  _buildHeaderIcon(
                    icon: Icons.person_outline_rounded,
                    onTap: () => context.push('/farmer/profile'),
                  ),
                ],
              ),
              const SizedBox(height: 28),
              const Text(
                'Welcome back,',
                style: TextStyle(
                  color: Colors.white70,
                  fontSize: 15,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 3),
              Text(
                auth.userName ?? 'Name unavailable',
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 27,
                  height: 1.15,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 9),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 11,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: Colors.black.withValues(alpha: 0.14),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  'Farmer ID: ${auth.userId ?? "N/A"}',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              const SizedBox(height: 20),
              _buildStatsPanel(stats),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildHeaderIcon({
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.white.withValues(alpha: 0.14),
      borderRadius: BorderRadius.circular(12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: SizedBox(
          width: 40,
          height: 40,
          child: Icon(icon, color: Colors.white, size: 22),
        ),
      ),
    );
  }

  Widget _buildStatsPanel(Map<String, dynamic>? stats) {
    final values = [
      ('Cultivations', stats?['totalCultivations']?.toString() ?? '0'),
      ('Active Batches', stats?['activeBatches']?.toString() ?? '0'),
      ('Requests', stats?['pendingRequests']?.toString() ?? '0'),
    ];

    return Container(
      padding: const EdgeInsets.symmetric(vertical: 15, horizontal: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(21),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Row(
        children: [
          for (var index = 0; index < values.length; index++) ...[
            Expanded(
              child: _buildStatItem(values[index].$1, values[index].$2),
            ),
            if (index != values.length - 1)
              Container(
                height: 36,
                width: 1,
                color: const Color(0xFFE4ECE1),
              ),
          ],
        ],
      ),
    );
  }

  Widget _buildStatItem(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            color: Color(0xFF174F36),
            fontSize: 21,
            fontWeight: FontWeight.w800,
          ),
        ),
        const SizedBox(height: 3),
        Text(
          label,
          textAlign: TextAlign.center,
          style: const TextStyle(
            color: Color(0xFF718071),
            fontSize: 10.5,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }

  Widget _buildFeatureGrid(BuildContext context) {
    final features = [
      _DashboardFeature(
        title: 'Cultivations',
        description: 'Track your growing activities',
        icon: Icons.grass_rounded,
        color: const Color(0xFF2E8B57),
        route: '/farmer/cultivations',
      ),
      _DashboardFeature(
        title: 'Create Batch',
        description: 'Add a new herb batch',
        icon: Icons.add_box_rounded,
        color: const Color(0xFFE28A21),
        route: '/farmer/batch/create',
      ),
      _DashboardFeature(
        title: 'My Batches',
        description: 'View your traceable batches',
        icon: Icons.inventory_2_rounded,
        color: const Color(0xFF3A73C0),
        route: '/farmer/batches',
      ),
      _DashboardFeature(
        title: 'Manufacturer Requests',
        description: 'Review incoming requests',
        icon: Icons.business_center_rounded,
        color: const Color(0xFF4C5FC4),
        route: '/farmer/requests',
      ),
      _DashboardFeature(
        title: 'Supervisor',
        description: 'Connect with your supervisor',
        icon: Icons.person_search_rounded,
        color: const Color(0xFF8A55B5),
        route: '/farmer/supervisor',
      ),
      _DashboardFeature(
        title: 'Notifications',
        description: 'Stay up to date',
        icon: Icons.notifications_rounded,
        color: const Color(0xFFD85555),
        route: '/farmer/notifications',
      ),
      _DashboardFeature(
        title: 'Profile',
        description: 'Manage your farmer profile',
        icon: Icons.account_circle_rounded,
        color: const Color(0xFF168A84),
        route: '/farmer/profile',
      ),
    ];

    return Padding(
      padding: const EdgeInsets.fromLTRB(18, 24, 18, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Quick actions',
            style: TextStyle(
              color: Color(0xFF244B35),
              fontSize: 19,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            'Manage your AyurTrace activities',
            style: TextStyle(
              color: Color(0xFF7B8B7D),
              fontSize: 12.5,
            ),
          ),
          const SizedBox(height: 14),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: features.length,
            gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
              maxCrossAxisExtent: 240,
              mainAxisExtent: 166,
              crossAxisSpacing: 13,
              mainAxisSpacing: 13,
            ),
            itemBuilder: (context, index) {
              final feature = features[index];
              return _buildMenuCard(context, feature);
            },
          ),
        ],
      ),
    );
  }

  Widget _buildMenuCard(BuildContext context, _DashboardFeature feature) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(20),
      child: InkWell(
        onTap: () => context.push(feature.route),
        borderRadius: BorderRadius.circular(20),
        child: Container(
          padding: const EdgeInsets.fromLTRB(14, 14, 12, 12),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: feature.color.withValues(alpha: 0.1)),
            boxShadow: [
              BoxShadow(
                color: feature.color.withValues(alpha: 0.07),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    width: 47,
                    height: 47,
                    decoration: BoxDecoration(
                      color: feature.color.withValues(alpha: 0.11),
                      borderRadius: BorderRadius.circular(15),
                    ),
                    child: Icon(feature.icon, color: feature.color, size: 27),
                  ),
                  Icon(
                    Icons.arrow_forward_rounded,
                    size: 18,
                    color: feature.color.withValues(alpha: 0.7),
                  ),
                ],
              ),
              const Spacer(),
              Text(
                feature.title,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  color: Color(0xFF25392B),
                  fontSize: 14,
                  height: 1.15,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 5),
              Text(
                feature.description,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  color: Color(0xFF849187),
                  fontSize: 10.5,
                  height: 1.2,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLogoutButton(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(18, 24, 18, 0),
      child: SizedBox(
        width: double.infinity,
        height: 52,
        child: OutlinedButton.icon(
          onPressed: () => _showLogoutDialog(context),
          icon: const Icon(Icons.logout_rounded, size: 20),
          label: const Text(
            'LOGOUT',
            style: TextStyle(fontWeight: FontWeight.w700, letterSpacing: 0.5),
          ),
          style: OutlinedButton.styleFrom(
            backgroundColor: const Color(0xFFFFF1F0),
            foregroundColor: const Color(0xFFD64D4D),
            side: const BorderSide(color: Color(0xFFFFD8D5)),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
          ),
        ),
      ),
    );
  }

  void _showLogoutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Logout'),
        content: const Text('Are you sure you want to logout?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('CANCEL'),
          ),
          TextButton(
            onPressed: () {
              context.read<AuthProvider>().logout();
              context.go('/');
            },
            child: const Text(
              'LOGOUT',
              style: TextStyle(color: Colors.red),
            ),
          ),
        ],
      ),
    );
  }
}

class _DashboardFeature {
  const _DashboardFeature({
    required this.title,
    required this.description,
    required this.icon,
    required this.color,
    required this.route,
  });

  final String title;
  final String description;
  final IconData icon;
  final Color color;
  final String route;
}
