class TraceabilityEvent {
  final String stage;
  final String description;
  final DateTime timestamp;
  final String location;

  TraceabilityEvent({
    required this.stage,
    required this.description,
    required this.timestamp,
    required this.location,
  });

  factory TraceabilityEvent.fromJson(Map<String, dynamic> json) {
    return TraceabilityEvent(
      stage: json['stage'],
      description: json['description'],
      timestamp: DateTime.parse(json['timestamp']),
      location: json['location'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'stage': stage,
      'description': description,
      'timestamp': timestamp.toIso8601String(),
      'location': location,
    };
  }
}
