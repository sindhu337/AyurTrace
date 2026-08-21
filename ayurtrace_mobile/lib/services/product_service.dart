import '../core/network/dio_client.dart';
import '../core/config/api_config.dart';
import '../models/product.dart';

class ProductService {
  final DioClient _dioClient = DioClient();

  Future<List<Product>> getAllProducts() async {
    try {
      final response = await _dioClient.dio.get(ApiConfig.products);
      if (response.statusCode == 200) {
        final List<dynamic> data = response.data;
        return data.map((json) => Product.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  Future<List<Product>> searchProducts(String query) async {
    try {
      final response = await _dioClient.dio.get(
        ApiConfig.products,
        queryParameters: {'query': query},
      );
      if (response.statusCode == 200) {
        final List<dynamic> data = response.data;
        return data.map((json) => Product.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }
}
