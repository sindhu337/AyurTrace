import 'cart_item.dart';

class Order {
  final String id;
  final String customerId;
  final List<CartItem> items;
  final double totalAmount;
  final DateTime orderDate;
  final String status;
  final String paymentMethod;

  Order({
    required this.id,
    required this.customerId,
    required this.items,
    required this.totalAmount,
    required this.orderDate,
    required this.status,
    required this.paymentMethod,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'],
      customerId: json['customerId'],
      items: (json['items'] as List).map((i) => CartItem.fromJson(i)).toList(),
      totalAmount: json['totalAmount'].toDouble(),
      orderDate: DateTime.parse(json['orderDate']),
      status: json['status'],
      paymentMethod: json['paymentMethod'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'customerId': customerId,
      'items': items.map((i) => i.toJson()).toList(),
      'totalAmount': totalAmount,
      'orderDate': orderDate.toIso8601String(),
      'status': status,
      'paymentMethod': paymentMethod,
    };
  }
}
