import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../models/product.dart';
import '../../../services/customer_service.dart';
import '../../../core/theme/app_theme.dart';

class ProductDetailsScreen extends StatefulWidget {
  final Product product;
  const ProductDetailsScreen({super.key, required this.product});

  @override
  State<ProductDetailsScreen> createState() => _ProductDetailsScreenState();
}

class _ProductDetailsScreenState extends State<ProductDetailsScreen> {
  int _quantity = 1;
  bool _isAdding = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.product.name)),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              height: 250,
              width: double.infinity,
              color: Colors.grey[200],
              child: widget.product.imageUrl.isNotEmpty
                  ? Image.network(widget.product.imageUrl, fit: BoxFit.cover, errorBuilder: (c, e, s) => const Icon(Icons.image, size: 100, color: Colors.grey))
                  : const Icon(Icons.image, size: 100, color: Colors.grey),
            ),
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        widget.product.category,
                        style: const TextStyle(color: AppTheme.primaryColor, fontWeight: FontWeight.bold),
                      ),
                      Text(
                        '₹${widget.product.price}',
                        style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.primaryColor),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    widget.product.name,
                    style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Manufacturer: ${widget.product.manufacturerName ?? "AYURTRACE Partner"}',
                    style: const TextStyle(color: Colors.grey, fontSize: 14),
                  ),
                  const SizedBox(height: 24),
                  const Text('Description', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                  const SizedBox(height: 8),
                  Text(
                    widget.product.description.isNotEmpty ? widget.product.description : 'No description available for this authentic Ayurvedic product.',
                    style: const TextStyle(fontSize: 15, height: 1.5, color: Colors.black87),
                  ),
                  const SizedBox(height: 24),
                  _buildStockInfo(),
                  const SizedBox(height: 32),
                  _buildQuantitySelector(),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomBar(),
    );
  }

  Widget _buildStockInfo() {
    final isAvailable = widget.product.stockQuantity > 0;
    return Row(
      children: [
        Icon(
          isAvailable ? Icons.check_circle : Icons.error,
          color: isAvailable ? Colors.green : Colors.red,
          size: 20,
        ),
        const SizedBox(width: 8),
        Text(
          isAvailable ? 'In Stock (${widget.product.stockQuantity} units)' : 'Out of Stock',
          style: TextStyle(color: isAvailable ? Colors.green : Colors.red, fontWeight: FontWeight.w500),
        ),
      ],
    );
  }

  Widget _buildQuantitySelector() {
    return Row(
      children: [
        const Text('Quantity:', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        const SizedBox(width: 16),
        Container(
          decoration: BoxDecoration(
            border: Border.all(color: Colors.grey.shade300),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Row(
            children: [
              IconButton(onPressed: () => setState(() => _quantity > 1 ? _quantity-- : null), icon: const Icon(Icons.remove)),
              Text('$_quantity', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              IconButton(onPressed: () => setState(() => _quantity < widget.product.stockQuantity ? _quantity++ : null), icon: const Icon(Icons.add)),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildBottomBar() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, -5))]),
      child: Row(
        children: [
          Expanded(
            child: ElevatedButton(
              onPressed: (widget.product.stockQuantity <= 0 || _isAdding) ? null : _addToCart,
              style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 54)),
              child: _isAdding 
                ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                : const Text('ADD TO CART'),
            ),
          ),
        ],
      ),
    );
  }

  void _addToCart() async {
    setState(() => _isAdding = true);
    final success = await context.read<CustomerService>().addToCart(widget.product, _quantity);
    if (mounted) setState(() => _isAdding = false);
    
    if (mounted) {
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('${widget.product.name} added to cart')));
      } else {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Failed to add to cart. Try again.')));
      }
    }
  }
}
