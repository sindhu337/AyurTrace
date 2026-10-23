import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/theme/app_theme.dart';

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
      body: LayoutBuilder(
        builder: (context, constraints) {
          final contentWidth = constraints.maxWidth > 620
              ? 500.0
              : constraints.maxWidth - 40;

          return Stack(
            fit: StackFit.expand,
            children: [
              const _BotanicalBackground(),
              SafeArea(
                child: SingleChildScrollView(
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 20,
                    vertical: 28,
                  ),
                  child: Center(
                    child: ConstrainedBox(
                      constraints: BoxConstraints(maxWidth: contentWidth),
                      child: Column(
                        children: [
                          if (_selectedAction != null)
                            Align(
                              alignment: Alignment.centerLeft,
                              child: IconButton(
                                onPressed: () =>
                                    setState(() => _selectedAction = null),
                                icon: const Icon(Icons.arrow_back),
                                color: _WelcomeColors.cream,
                                tooltip: 'Back',
                              ),
                            ),
                          const SizedBox(height: 12),
                          const Icon(
                            Icons.eco,
                            size: 58,
                            color: _WelcomeColors.cream,
                          ),
                          const SizedBox(height: 10),
                          const Text(
                            'AYURTRACE',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              color: _WelcomeColors.cream,
                              fontSize: 30,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 3,
                            ),
                          ),
                          const SizedBox(height: 5),
                          const Text(
                            'Trace the Purity of Ayurveda',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              color: Colors.white70,
                              fontSize: 14,
                              letterSpacing: 0.4,
                            ),
                          ),
                          const SizedBox(height: 42),
                          const Text(
                            "Nature's Journey,",
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              color: _WelcomeColors.cream,
                              fontSize: 28,
                              fontWeight: FontWeight.w300,
                              height: 1.1,
                            ),
                          ),
                          const Text(
                            'Verified',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              color: _WelcomeColors.gold,
                              fontSize: 31,
                              fontWeight: FontWeight.w800,
                              height: 1.1,
                            ),
                          ),
                          const SizedBox(height: 12),
                          const Text(
                            'Trusted traceability for authentic Ayurvedic herbs '
                            'from farm to formulation.',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              color: Colors.white70,
                              fontSize: 14,
                              height: 1.45,
                            ),
                          ),
                          const SizedBox(height: 30),
                          if (_selectedAction == null) ...[
                            _buildActionCard(
                              title: 'Login',
                              subtitle: 'Access your AyurTrace account',
                              icon: Icons.login_rounded,
                              action: 'login',
                            ),
                            const SizedBox(height: 14),
                            _buildActionCard(
                              title: 'Register',
                              subtitle: 'Create a new AyurTrace account',
                              icon: Icons.person_add_alt_1_rounded,
                              action: 'register',
                            ),
                          ] else
                            _buildRoleSelector(context),
                          const SizedBox(height: 18),
                          _buildTraceButton(context),
                          const SizedBox(height: 25),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildActionCard({
    required String title,
    required String subtitle,
    required IconData icon,
    required String action,
  }) {
    return Semantics(
      button: true,
      label: '$title. $subtitle',
      child: InkWell(
        borderRadius: BorderRadius.circular(22),
        onTap: () {
          setState(() {
            _selectedAction = action;
            _selectedRole = 'FARMER';
          });
        },
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
          decoration: BoxDecoration(
            color: _WelcomeColors.cream.withValues(alpha: 0.94),
            borderRadius: BorderRadius.circular(22),
            border: Border.all(color: Colors.white.withValues(alpha: 0.8)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.2),
                blurRadius: 18,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: const BoxDecoration(
                  color: _WelcomeColors.paleGreen,
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, color: AppTheme.primaryColor, size: 25),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        color: _WelcomeColors.ink,
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 3),
                    Text(
                      subtitle,
                      style: const TextStyle(
                        color: _WelcomeColors.mutedInk,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
              const Icon(
                Icons.chevron_right_rounded,
                color: _WelcomeColors.mutedInk,
                size: 27,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRoleSelector(BuildContext context) {
    final isLogin = _selectedAction == 'login';
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: _WelcomeColors.cream.withValues(alpha: 0.95),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: Colors.white.withValues(alpha: 0.8)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.2),
            blurRadius: 18,
            offset: const Offset(0, 8),
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
              color: AppTheme.primaryColor,
              fontSize: 18,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 14),
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
          const SizedBox(height: 14),
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

  Widget _buildTraceButton(BuildContext context) {
    return Semantics(
      button: true,
      label: 'Quick Trace with QR',
      child: OutlinedButton(
        onPressed: () => context.push('/trace'),
        style: OutlinedButton.styleFrom(
          foregroundColor: _WelcomeColors.cream,
          backgroundColor: _WelcomeColors.deepGreen.withValues(alpha: 0.6),
          side: const BorderSide(color: _WelcomeColors.gold),
          padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(30),
          ),
        ),
        child: const Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.qr_code_scanner_rounded, size: 20),
            SizedBox(width: 9),
            Text(
              'Quick Trace with QR',
              style: TextStyle(fontWeight: FontWeight.w700),
            ),
            SizedBox(width: 8),
            Icon(Icons.chevron_right_rounded, size: 21),
          ],
        ),
      ),
    );
  }
}

class _WelcomeColors {
  static const deepGreen = Color(0xFF0D3528);
  static const forest = Color(0xFF174B35);
  static const moss = Color(0xFF4C8651);
  static const paleGreen = Color(0xFFE5F0D8);
  static const cream = Color(0xFFF8F4E8);
  static const gold = Color(0xFFE7C878);
  static const ink = Color(0xFF193329);
  static const mutedInk = Color(0xFF61706A);
}

class _BotanicalBackground extends StatelessWidget {
  const _BotanicalBackground();

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: _BotanicalPainter(),
      child: const SizedBox.expand(),
    );
  }
}

class _BotanicalPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final rect = Offset.zero & size;
    final background = Paint()
      ..shader = const LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [
          _WelcomeColors.deepGreen,
          _WelcomeColors.forest,
          _WelcomeColors.moss,
        ],
      ).createShader(rect);
    canvas.drawRect(rect, background);

    final glow = Paint()
      ..shader =
          RadialGradient(
            colors: [Colors.white.withValues(alpha: 0.14), Colors.transparent],
          ).createShader(
            Rect.fromCircle(
              center: Offset(size.width * 0.5, size.height * 0.16),
              radius: size.width * 0.75,
            ),
          );
    canvas.drawRect(rect, glow);

    final mountain = Paint()
      ..color = const Color(0xFF83A86A).withValues(alpha: 0.3);
    final mountainPath = Path()
      ..moveTo(0, size.height * 0.66)
      ..quadraticBezierTo(
        size.width * 0.2,
        size.height * 0.49,
        size.width * 0.42,
        size.height * 0.65,
      )
      ..quadraticBezierTo(
        size.width * 0.7,
        size.height * 0.42,
        size.width,
        size.height * 0.62,
      )
      ..lineTo(size.width, size.height)
      ..lineTo(0, size.height)
      ..close();
    canvas.drawPath(mountainPath, mountain);

    _drawLeaf(canvas, Offset(size.width * 0.08, size.height * 0.22), 1.1);
    _drawLeaf(canvas, Offset(size.width * 0.9, size.height * 0.3), -1.0);
    _drawLeaf(canvas, Offset(size.width * 0.05, size.height * 0.76), 0.8);
    _drawLeaf(canvas, Offset(size.width * 0.94, size.height * 0.72), -0.75);
    _drawMortar(canvas, Offset(size.width * 0.78, size.height * 0.91));
  }

  void _drawLeaf(Canvas canvas, Offset origin, double direction) {
    final stem = Paint()
      ..color = const Color(0xFFB0CC82).withValues(alpha: 0.32)
      ..strokeWidth = 2;
    canvas.drawLine(origin, origin + Offset(35 * direction, -90), stem);

    final leaf = Paint()
      ..color = const Color(0xFF8CAF69).withValues(alpha: 0.28);
    for (var i = 0; i < 4; i++) {
      final center =
          origin + Offset((i.isEven ? 1 : -1) * 19 * direction, -20.0 - i * 20);
      canvas.drawOval(
        Rect.fromCenter(center: center, width: 28, height: 12),
        leaf,
      );
    }
  }

  void _drawMortar(Canvas canvas, Offset center) {
    final bowl = Paint()
      ..color = const Color(0xFF8F6844).withValues(alpha: 0.5);
    canvas.drawOval(
      Rect.fromCenter(center: center, width: 82, height: 34),
      bowl,
    );
    canvas.drawRect(Rect.fromLTWH(center.dx - 40, center.dy - 3, 80, 23), bowl);
    final pestle = Paint()
      ..color = const Color(0xFFD2A66B).withValues(alpha: 0.55)
      ..strokeWidth = 8
      ..strokeCap = StrokeCap.round;
    canvas.drawLine(
      center + const Offset(15, -8),
      center + const Offset(45, -52),
      pestle,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
