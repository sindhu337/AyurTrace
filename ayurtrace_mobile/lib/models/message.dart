class Message {
  final String id;
  final String senderId;
  final String senderRole;
  final String receiverId;
  final String receiverRole;
  final String content;
  final DateTime timestamp;

  Message({
    required this.id,
    required this.senderId,
    required this.senderRole,
    required this.receiverId,
    required this.receiverRole,
    required this.content,
    required this.timestamp,
  });

  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      id: json['id'].toString(),
      senderId: json['senderId'].toString(),
      senderRole: json['senderRole'] ?? '',
      receiverId: json['receiverId'].toString(),
      receiverRole: json['receiverRole'] ?? '',
      content: json['content'] ?? '',
      timestamp: DateTime.parse(json['timestamp']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'senderId': senderId,
      'senderRole': senderRole,
      'receiverId': receiverId,
      'receiverRole': receiverRole,
      'content': content,
      'timestamp': timestamp.toIso8601String(),
    };
  }
}
