import 'package:flutter/material.dart';
import '../../core/network/dio_client.dart';
import '../../core/storage/secure_storage.dart';
import '../../core/config/api_config.dart';
import 'package:dio/dio.dart';

enum AuthStatus { authenticated, unauthenticated, authenticating }

class AuthProvider with ChangeNotifier {
  final DioClient _dioClient = DioClient();
  final SecureStorage _secureStorage = SecureStorage();

  AuthStatus _status = AuthStatus.unauthenticated;
  String? _userRole;
  String? _userId;
  String? _errorMessage;

  AuthStatus get status => _status;
  String? get userRole => _userRole;
  String? get userId => _userId;
  String? get errorMessage => _errorMessage;

  Future<bool> login(String identifier, String password, String role) async {
    _status = AuthStatus.authenticating;
    _errorMessage = null;
    notifyListeners();

    try {
      final url = role == 'FARMER' ? ApiConfig.farmerLogin : ApiConfig.customerLogin;
      final Map<String, dynamic> data = role == 'FARMER'
          ? {'farmerId': identifier, 'password': password}
          : {'mobile': identifier, 'password': password};

      final response = await _dioClient.dio.post(url, data: data);

      if (response.statusCode == 200) {
        final resData = response.data;
        
        // Check if the response contains an error message (even with 200 OK, though usually 4xx)
        if (resData is Map && resData.containsKey('status') && resData['status'] == 'ERROR') {
          _errorMessage = resData['message'] ?? 'Login failed';
          _status = AuthStatus.unauthenticated;
          notifyListeners();
          return false;
        }

        final token = resData['token'];
        _userRole = resData['role'];
        _userId = resData['id'].toString();

        await _secureStorage.saveToken(token);
        await _secureStorage.saveUserRole(_userRole!);
        await _secureStorage.saveUserId(_userId!);

        _status = AuthStatus.authenticated;
        notifyListeners();
        return true;
      }
    } on DioException catch (e) {
      if (e.response != null) {
        final dynamic resBody = e.response!.data;
        if (resBody is Map && resBody.containsKey('message')) {
          _errorMessage = resBody['message'];
        } else if (resBody is String) {
          _errorMessage = resBody;
        } else {
          _errorMessage = "Login failed: ${e.response?.statusCode}";
        }
        debugPrint("Login error response: $resBody");
      } else {
        _errorMessage = "Connection error. Check laptop IP and Wi-Fi.";
        debugPrint("Login connection error: ${e.type} - ${e.message}");
      }
    } catch (e) {
      _errorMessage = "Unexpected error: $e";
      debugPrint("Login unexpected error: $e");
    }

    _status = AuthStatus.unauthenticated;
    notifyListeners();
    return false;
  }

  Future<bool> register(Map<String, dynamic> userData) async {
    _errorMessage = null;
    final role = userData['role'] ?? 'CUSTOMER';
    final url = role == 'FARMER' ? ApiConfig.farmerRegister : ApiConfig.customerRegister;

    try {
      debugPrint("Attempting register to: $url");
      debugPrint("Data: $userData");

      // Remove role from data if present to match backend DTO
      userData.remove('role');

      final response = await _dioClient.dio.post(url, data: userData);
      debugPrint("Register Success: ${response.statusCode}");
      return response.statusCode == 201 || response.statusCode == 200;
    } on DioException catch (e) {
      debugPrint("REGISTER DIO EXCEPTION:");
      debugPrint("URL: ${e.requestOptions.uri}");
      debugPrint("Status: ${e.response?.statusCode}");
      debugPrint("Response Data: ${e.response?.data}");
      debugPrint("Message: ${e.message}");
      debugPrint("Type: ${e.type}");

      if (e.response != null) {
        final dynamic data = e.response!.data;
        if (data is Map && data.containsKey('message')) {
          _errorMessage = data['message'].toString();
        } else {
          _errorMessage = data.toString();
        }
      } else if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout) {
        _errorMessage = "Connection timed out. Check your laptop IP ($url)";
      } else if (e.type == DioExceptionType.connectionError) {
        _errorMessage = "Cannot reach server. Verify phone is on the same Wi-Fi as laptop ($url)";
      } else {
        _errorMessage = "Network error: ${e.message ?? 'Check connection'}";
      }
      return false;
    } catch (e) {
      debugPrint("REGISTER UNEXPECTED ERROR: $e");
      _errorMessage = "Unexpected error: $e";
      return false;
    }
  }

  Future<String?> checkConnection() async {
    final url = '${ApiConfig.apiV1}/auth/ping';
    try {
      final response = await _dioClient.dio.get(url);
      return "SUCCESS: Server is reachable at $url\nResponse: ${response.data}";
    } catch (e) {
      if (e is DioException) {
        return "FAILED: Cannot reach $url\nError: ${e.message}\nCheck if Laptop IP is correct and Wi-Fi is shared.";
      }
      return "FAILED: $e";
    }
  }

  Future<void> logout() async {
    await _secureStorage.clearAll();
    _status = AuthStatus.unauthenticated;
    _userRole = null;
    _userId = null;
    _errorMessage = null;
    notifyListeners();
  }

  Future<void> checkAuthStatus() async {
    final token = await _secureStorage.getToken();
    if (token != null) {
      _userRole = await _secureStorage.getUserRole();
      _userId = await _secureStorage.getUserId();
      _status = AuthStatus.authenticated;
    } else {
      _status = AuthStatus.unauthenticated;
    }
    notifyListeners();
  }
}
