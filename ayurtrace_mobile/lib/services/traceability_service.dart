import '../core/network/dio_client.dart';
import '../core/config/api_config.dart';
import '../models/traceability_response.dart';

class TraceabilityService {
  final DioClient _dioClient = DioClient();

  Future<TraceabilityResponse?> getProductHistory(String qrId) async {
    try {
      final response = await _dioClient.dio.get('${ApiConfig.traceability}/$qrId');
      if (response.statusCode == 200) {
        return TraceabilityResponse.fromJson(response.data);
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}
