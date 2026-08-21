class Batch {
  final String id;
  final String cultivationId;
  final String batchNumber;
  final double quantity;
  final String quantityUnit;
  final DateTime harvestDate;
  final String location;
  final double latitude;
  final double longitude;
  final String notes;
  final String qrCode;
  final String status;

  Batch({
    required this.id,
    required this.cultivationId,
    required this.batchNumber,
    required this.quantity,
    this.quantityUnit = 'kg',
    required this.harvestDate,
    required this.location,
    this.latitude = 0.0,
    this.longitude = 0.0,
    this.notes = '',
    required this.qrCode,
    required this.status,
  });

  factory Batch.fromJson(Map<String, dynamic> json) {
    return Batch(
      id: json['id'].toString(),
      cultivationId: json['cultivation']?['id']?.toString() ?? '',
      batchNumber: json['batchNumber'] ?? '',
      quantity: (json['quantity'] as num?)?.toDouble() ?? 0.0,
      quantityUnit: json['quantityUnit'] ?? 'kg',
      harvestDate: DateTime.parse(json['harvestDate']),
      location: json['location'] ?? '',
      latitude: (json['latitude'] as num?)?.toDouble() ?? 0.0,
      longitude: (json['longitude'] as num?)?.toDouble() ?? 0.0,
      notes: json['notes'] ?? '',
      qrCode: json['qrCode'] ?? '',
      status: json['status'] ?? 'CREATED',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'quantity': quantity,
      'quantityUnit': quantityUnit,
      'harvestDate': harvestDate.toIso8601String().split('T')[0],
      'location': location,
      'latitude': latitude,
      'longitude': longitude,
      'notes': notes,
    };
  }
}
