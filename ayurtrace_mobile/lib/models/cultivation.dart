class Cultivation {
  final String id;
  final String farmerId;
  final String herbName;
  final String area;
  final String areaUnit;
  final String cultivationMethod;
  final DateTime plantingDate;
  final DateTime expectedHarvestDate;
  final double expectedQuantity;
  final String quantityUnit;
  final double price;
  final String location;
  final double latitude;
  final double longitude;
  final String notes;
  final String status;

  Cultivation({
    required this.id,
    required this.farmerId,
    required this.herbName,
    required this.area,
    required this.areaUnit,
    required this.cultivationMethod,
    required this.plantingDate,
    required this.expectedHarvestDate,
    required this.expectedQuantity,
    required this.quantityUnit,
    required this.price,
    required this.location,
    required this.latitude,
    required this.longitude,
    this.notes = '',
    required this.status,
  });

  factory Cultivation.fromJson(Map<String, dynamic> json) {
    return Cultivation(
      id: json['id'].toString(),
      farmerId: json['farmer']?['id']?.toString() ?? '',
      herbName: json['herbName'] ?? '',
      area: json['area']?.toString() ?? '',
      areaUnit: json['areaUnit'] ?? 'Acres',
      cultivationMethod: json['cultivationMethod'] ?? 'Organic',
      plantingDate: DateTime.parse(json['plantingDate']),
      expectedHarvestDate: DateTime.parse(json['expectedHarvestDate']),
      expectedQuantity: (json['expectedQuantity'] as num?)?.toDouble() ?? 0.0,
      quantityUnit: json['quantityUnit'] ?? 'kg',
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      location: json['location'] ?? '',
      latitude: (json['latitude'] as num?)?.toDouble() ?? 0.0,
      longitude: (json['longitude'] as num?)?.toDouble() ?? 0.0,
      notes: json['notes'] ?? '',
      status: json['status'] ?? 'PLANTED',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'herbName': herbName,
      'area': area,
      'areaUnit': areaUnit,
      'cultivationMethod': cultivationMethod,
      'plantingDate': plantingDate.toIso8601String().split('T')[0],
      'expectedHarvestDate': expectedHarvestDate.toIso8601String().split('T')[0],
      'expectedQuantity': expectedQuantity,
      'quantityUnit': quantityUnit,
      'price': price,
      'location': location,
      'latitude': latitude,
      'longitude': longitude,
      'notes': notes,
      'status': status,
    };
  }
}
