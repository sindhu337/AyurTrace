import 'package:flutter/material.dart';
import '../core/network/dio_client.dart';
import '../core/config/api_config.dart';
import '../models/cart_item.dart';
import '../models/order.dart';
import '../models/product.dart';

class CustomerService with ChangeNotifier {
  final DioClient _dioClient = DioClient();

  Future<List<Product>> getFavourites() async {
    try {
      final response = await _dioClient.dio.get(ApiConfig.favourites);
      if (response.statusCode == 200) {
        final List<dynamic> data = response.data;
        return data.map((json) => Product.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  Future<bool> addToFavourite(String productId) async {
    try {
      final response = await _dioClient.dio.post('${ApiConfig.favourites}/$productId');
      return response.statusCode == 200 || response.statusCode == 201;
    } catch (e) {
      return false;
    }
  }

  Future<List<CartItem>> getCart() async {
    try {
      final response = await _dioClient.dio.get(ApiConfig.cart);
      if (response.statusCode == 200) {
        // Handle both List and Map responses depending on backend DTO
        final dynamic data = response.data;
        if (data is List) {
           return data.map((json) => CartItem.fromJson(json)).toList();
        } else if (data is Map && data.containsKey('items')) {
           return (data['items'] as List).map((json) => CartItem.fromJson(json)).toList();
        }
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  Future<bool> addToCart(Product product, int quantity) async {
    try {
      final response = await _dioClient.dio.post(
        ApiConfig.cart,
        queryParameters: {'productId': product.id, 'quantity': quantity},
      );
      return response.statusCode == 200 || response.statusCode == 201;
    } catch (e) {
      return false;
    }
  }

  Future<bool> updateCartItem(String productId, int quantity) async {
    try {
      if (quantity <= 0) return await removeFromCart(productId);
      final response = await _dioClient.dio.put(
        ApiConfig.cart,
        queryParameters: {'productId': productId, 'quantity': quantity},
      );
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  Future<bool> removeFromCart(String productId) async {
    try {
      final response = await _dioClient.dio.delete('${ApiConfig.cart}/$productId');
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  Future<bool> checkout(String customerId, String method) async {
    try {
      final response = await _dioClient.dio.post(
        ApiConfig.checkout,
        queryParameters: {'paymentMethod': method},
      );
      return response.statusCode == 200 || response.statusCode == 201;
    } catch (e) {
      return false;
    }
  }

  Future<List<Order>> getOrders(String customerId) async {
    try {
      final response = await _dioClient.dio.get(ApiConfig.orders);
      if (response.statusCode == 200) {
        final List<dynamic> data = response.data;
        return data.map((json) => Order.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  Future<Map<String, dynamic>?> getProfile() async {
    try {
      final response = await _dioClient.dio.get('${ApiConfig.customerBase}/profile');
      if (response.statusCode == 200) {
        return response.data;
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}
