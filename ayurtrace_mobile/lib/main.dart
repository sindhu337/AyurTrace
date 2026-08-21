import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:device_preview/device_preview.dart';
import 'package:flutter/foundation.dart';
import 'core/theme/app_theme.dart';
import 'features/auth/auth_provider.dart';
import 'features/home/role_selection_screen.dart';
import 'features/auth/login_screen.dart';
import 'features/auth/register_screen.dart';
import 'features/farmer/farmer_dashboard.dart';
import 'features/farmer/cultivation/add_cultivation_screen.dart';
import 'features/farmer/cultivation/my_cultivations_screen.dart';
import 'features/farmer/cultivation/cultivation_requests_screen.dart';
import 'features/farmer/batch/create_batch_screen.dart';
import 'features/farmer/batch/my_batches_screen.dart';
import 'features/farmer/supervisor/contact_supervisor_screen.dart';
import 'features/farmer/notifications/notifications_screen.dart';
import 'features/farmer/profile/profile_screen.dart';
import 'features/customer/customer_dashboard.dart';
import 'features/customer/cart_screen.dart';
import 'features/customer/products/product_details_screen.dart';
import 'features/traceability/qr_scanner_screen.dart';
import 'models/product.dart';

import 'services/product_service.dart';
import 'services/farmer_service.dart';
import 'services/customer_service.dart';
import 'services/traceability_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    DevicePreview(
      enabled: !kReleaseMode,
      builder: (context) => MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => AuthProvider()..checkAuthStatus()),
          ChangeNotifierProvider(create: (_) => FarmerService()),
          ChangeNotifierProvider(create: (_) => CustomerService()),
          Provider(create: (_) => ProductService()),
          Provider(create: (_) => TraceabilityService()),
        ],
        child: const AyurTraceApp(),
      ),
    ),
  );
}

final _router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const RoleSelectionScreen(),
    ),
    GoRoute(
      path: '/login',
      builder: (context, state) {
        final role = state.uri.queryParameters['role'] ?? 'CUSTOMER';
        return LoginScreen(role: role);
      },
    ),
    GoRoute(
      path: '/register',
      builder: (context, state) {
        final role = state.uri.queryParameters['role'] ?? 'CUSTOMER';
        return RegisterScreen(role: role);
      },
    ),
    GoRoute(
      path: '/farmer-dashboard',
      builder: (context, state) => const FarmerDashboard(),
    ),
    // Farmer Detailed Routes
    GoRoute(
      path: '/farmer/cultivations',
      builder: (context, state) => const MyCultivationsScreen(),
    ),
    GoRoute(
      path: '/farmer/requests',
      builder: (context, state) => const CultivationRequestsScreen(),
    ),
    GoRoute(
      path: '/farmer/cultivation/add',
      builder: (context, state) => const AddCultivationScreen(),
    ),
    GoRoute(
      path: '/farmer/batch/create',
      builder: (context, state) => const CreateBatchScreen(),
    ),
    GoRoute(
      path: '/farmer/batches',
      builder: (context, state) => const MyBatchesScreen(),
    ),
    GoRoute(
      path: '/farmer/supervisor',
      builder: (context, state) => const ContactSupervisorScreen(),
    ),
    GoRoute(
      path: '/farmer/notifications',
      builder: (context, state) => const NotificationsScreen(),
    ),
    GoRoute(
      path: '/farmer/profile',
      builder: (context, state) => const ProfileScreen(),
    ),
    
    GoRoute(
      path: '/customer-dashboard',
      builder: (context, state) => const CustomerDashboard(),
    ),
    GoRoute(
      path: '/cart',
      builder: (context, state) => const CartScreen(),
    ),
    GoRoute(
      path: '/product-details',
      builder: (context, state) {
        final product = state.extra as Product;
        return ProductDetailsScreen(product: product);
      },
    ),
    GoRoute(
      path: '/trace',
      builder: (context, state) => const QRScannerScreen(),
    ),
  ],
);

class AyurTraceApp extends StatelessWidget {
  const AyurTraceApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      locale: DevicePreview.locale(context),
      builder: DevicePreview.appBuilder,
      title: 'AYURTRACE',
      theme: AppTheme.lightTheme,
      routerConfig: _router,
      debugShowCheckedModeBanner: false,
    );
  }
}
