import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

import 'package:provider/provider.dart';
import '../../services/customer_service.dart';
import '../../models/cart_item.dart';
import '../auth/auth_provider.dart';

class CartScreen extends StatelessWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final customerService = context.watch<CustomerService>();
    final cartItems = customerService.getCart();

    return Scaffold(
      appBar: AppBar(title: const Text('Shopping Cart')),
      body: FutureBuilder<List<CartItem>>(
        future: cartItems,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) return const Center(child: CircularProgressIndicator());
          final items = snapshot.data ?? [];
          if (items.isEmpty) return const Center(child: Text('Your cart is empty.'));

          double total = items.fold(0, (sum, item) => sum + (item.product.price * item.quantity));

          return Column(
            children: [
              Expanded(
                child: ListView.builder(
                  itemCount: items.length,
                  itemBuilder: (context, index) {
                    final item = items[index];
                    return ListTile(
                      leading: const Icon(Icons.eco, color: AppTheme.primaryColor),
                      title: Text(item.product.name),
                      subtitle: Text('₹${item.product.price} x ${item.quantity}'),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          IconButton(
                            icon: const Icon(Icons.remove),
                            onPressed: () => customerService.updateCartItem(item.product.id, item.quantity - 1),
                          ),
                          Text(item.quantity.toString()),
                          IconButton(
                            icon: const Icon(Icons.add),
                            onPressed: () => customerService.updateCartItem(item.product.id, item.quantity + 1),
                          ),
                          IconButton(
                            icon: const Icon(Icons.delete, color: Colors.red),
                            onPressed: () => customerService.removeFromCart(item.product.id),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Total:', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                        Text('₹$total', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.primaryColor)),
                      ],
                    ),
                    const SizedBox(height: 20),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () => _showPaymentDialog(context, total),
                        child: const Text('CHECKOUT'),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  void _showPaymentDialog(BuildContext context, double total) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('DUMMY PAYMENT'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Amount to Pay: ₹$total', style: const TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            const Text('Choose a demo payment method:'),
            const SizedBox(height: 12),
            _buildPaymentOption(context, 'Demo UPI', Icons.qr_code),
            _buildPaymentOption(context, 'Demo Card', Icons.credit_card),
            _buildPaymentOption(context, 'Cash on Delivery', Icons.money),
          ],
        ),
      ),
    );
  }

  Widget _buildPaymentOption(BuildContext context, String name, IconData icon) {
    return ListTile(
      leading: Icon(icon, color: AppTheme.primaryColor),
      title: Text(name),
      onTap: () => _processCheckout(context, name),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      visualDensity: VisualDensity.compact,
    );
  }

  void _processCheckout(BuildContext context, String method) async {
    final customerId = context.read<AuthProvider>().userId ?? '';
    
    // Show local loading
    Navigator.pop(context); // Close dialog
    
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (c) => const Center(child: CircularProgressIndicator()),
    );

    final success = await context.read<CustomerService>().checkout(customerId, method);
    
    if (context.mounted) {
      Navigator.pop(context); // Close loading
      
      if (success) {
        _showSuccessDialog(context);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Checkout failed. Try again.')));
      }
    }
  }

  void _showSuccessDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (c) => AlertDialog(
        title: const Icon(Icons.check_circle, color: Colors.green, size: 60),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Order Placed!', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Text('Your demo payment was successful and the order has been created.'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(c); // Close success
              Navigator.pop(context); // Go back from cart
            },
            child: const Text('GREAT'),
          )
        ],
      ),
    );
  }
}
