import 'package:flutter/material.dart';
import '../core/network/dio_client.dart';
import '../models/cultivation.dart';
import '../models/batch.dart';
import '../models/notification_model.dart';
import '../models/message.dart';
import '../core/config/api_config.dart';

class FarmerService with ChangeNotifier {
  final DioClient _dioClient = DioClient();
  Map<String, dynamic>? _stats;

  Map<String, dynamic>? get stats => _stats;

  Future<void> fetchDashboardStats() async {
    try {
      final response = await _dioClient.dio.get('${ApiConfig.farmerBase}/stats');
      _stats = response.data;
      notifyListeners();
    } catch (e) {
      debugPrint("Fetch Stats Error: $e");
    }
  }

  Future<List<Cultivation>> getCultivations(String farmerId) async {
    final response = await _dioClient.dio.get(ApiConfig.cultivations);
    return (response.data as List).map((e) => Cultivation.fromJson(e)).toList();
  }

  Future<void> addCultivation(Map<String, dynamic> data) async {
    await _dioClient.dio.post(ApiConfig.cultivation, data: data);
  }

  Future<List<Batch>> getBatches(String farmerId) async {
    final response = await _dioClient.dio.get(ApiConfig.batches);
    return (response.data as List).map((e) => Batch.fromJson(e)).toList();
  }

  Future<Map<String, dynamic>> createBatch(String cultivationId, Map<String, dynamic> data) async {
    final response = await _dioClient.dio.post(
      ApiConfig.batch,
      queryParameters: {'cultivationId': cultivationId},
      data: data,
    );
    return Map<String, dynamic>.from(response.data as Map);
  }

  Future<List<NotificationModel>> getNotifications() async {
    final response = await _dioClient.dio.get(ApiConfig.notifications);
    return (response.data as List).map((e) => NotificationModel.fromJson(e)).toList();
  }

  Future<void> markNotificationRead(String id) async {
    await _dioClient.dio.post('${ApiConfig.farmerBase}/notifications/$id/read');
  }

  Future<void> markAllNotificationsRead() async {
    await _dioClient.dio.post('${ApiConfig.farmerBase}/notifications/read-all');
  }

  Future<List<Message>> getMessages() async {
    final response = await _dioClient.dio.get(ApiConfig.messages);
    return (response.data as List).map((e) => Message.fromJson(e)).toList();
  }

  Future<void> sendMessage(String receiverId, String content) async {
    await _dioClient.dio.post(ApiConfig.message, queryParameters: {'receiverId': receiverId}, data: content);
  }

  Future<Map<String, dynamic>> getProfile() async {
    final response = await _dioClient.dio.get(ApiConfig.farmerProfile);
    return response.data;
  }

  Future<void> updateProfile(Map<String, dynamic> data) async {
    await _dioClient.dio.put(ApiConfig.farmerProfile, data: data);
  }

  Future<List<dynamic>> getCultivationRequests() async {
    final response = await _dioClient.dio.get('${ApiConfig.farmerBase}/requests');
    return response.data as List;
  }

  Future<void> updateRequestStatus(int requestId, String status) async {
    await _dioClient.dio.post('${ApiConfig.farmerBase}/requests/$requestId/status', queryParameters: {'status': status});
  }

  Future<Map<String, dynamic>> getSupervisor() async {
    final response = await _dioClient.dio.get('${ApiConfig.farmerBase}/supervisor');
    return response.data;
  }

  // Mock methods for dashboard stats if backend doesn't provide them directly
  int getCultivationCount() => 0; // Usually calculated from fetched list
  int getBatchCount() => 0;
}
