class NotificationModel {
  final String id;
  final String title;
  final String message;
  final DateTime timestamp;
  final bool isRead;

  NotificationModel({
    required this.id,
    this.title = 'Notification',
    required this.message,
    required this.timestamp,
    this.isRead = false,
  });

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    return NotificationModel(
      id: json['id'].toString(),
      title: json['userRole'] == 'ROLE_SUPERVISOR' ? 'Supervisor message' : 'System Alert',
      message: json['message'] ?? '',
      timestamp: DateTime.parse(json['timestamp']),
      isRead: json['read'] ?? false, // Check if backend uses 'isRead' or 'read'
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'message': message,
      'timestamp': timestamp.toIso8601String(),
      'isRead': isRead,
    };
  }
}
