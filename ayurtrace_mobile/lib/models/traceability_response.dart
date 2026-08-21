class TraceabilityResponse {
  final String qrId;
  final DateTime qrGeneratedAt;

  // Product
  final int? productId;
  final String? productName;
  final String? productDescription;
  final double? productPrice;
  final DateTime? manufacturingDate;
  final DateTime? expiryDate;
  final String? productImageUrl;

  // Manufacturer
  final int? manufacturerDbId;
  final String? manufacturerIdCode;
  final String? manufacturerCompanyName;
  final String? manufacturerOwnerName;
  final String? manufacturerState;
  final String? manufacturerDistrict;

  // Batch
  final int? batchId;
  final String? batchNumber;
  final double? batchQuantity;
  final String? batchQuantityUnit;
  final DateTime? harvestDate;
  final String? batchLocation;

  // Cultivation
  final int? cultivationId;
  final String? herbName;
  final String? cultivationMethod;
  final DateTime? plantingDate;
  final DateTime? expectedHarvestDate;
  final String? cultivationLocation;
  final double? cultivationLatitude;
  final double? cultivationLongitude;

  // Farmer
  final int? farmerDbId;
  final String? farmerId;
  final String? farmerName;
  final String? farmerState;
  final String? farmerDistrict;
  final double? farmerLatitude;
  final double? farmerLongitude;

  TraceabilityResponse({
    required this.qrId,
    required this.qrGeneratedAt,
    this.productId,
    this.productName,
    this.productDescription,
    this.productPrice,
    this.manufacturingDate,
    this.expiryDate,
    this.productImageUrl,
    this.manufacturerDbId,
    this.manufacturerIdCode,
    this.manufacturerCompanyName,
    this.manufacturerOwnerName,
    this.manufacturerState,
    this.manufacturerDistrict,
    this.batchId,
    this.batchNumber,
    this.batchQuantity,
    this.batchQuantityUnit,
    this.harvestDate,
    this.batchLocation,
    this.cultivationId,
    this.herbName,
    this.cultivationMethod,
    this.plantingDate,
    this.expectedHarvestDate,
    this.cultivationLocation,
    this.cultivationLatitude,
    this.cultivationLongitude,
    this.farmerDbId,
    this.farmerId,
    this.farmerName,
    this.farmerState,
    this.farmerDistrict,
    this.farmerLatitude,
    this.farmerLongitude,
  });

  factory TraceabilityResponse.fromJson(Map<String, dynamic> json) {
    return TraceabilityResponse(
      qrId: json['qrId'] ?? '',
      qrGeneratedAt: json['qrGeneratedAt'] != null 
          ? DateTime.parse(json['qrGeneratedAt']) 
          : DateTime.now(),
      productId: json['productId'],
      productName: json['productName'],
      productDescription: json['productDescription'],
      productPrice: (json['productPrice'] as num?)?.toDouble(),
      manufacturingDate: json['manufacturingDate'] != null ? DateTime.parse(json['manufacturingDate']) : null,
      expiryDate: json['expiryDate'] != null ? DateTime.parse(json['expiryDate']) : null,
      productImageUrl: json['productImageUrl'],
      manufacturerDbId: json['manufacturerDbId'],
      manufacturerIdCode: json['manufacturerIdCode'],
      manufacturerCompanyName: json['manufacturerCompanyName'],
      manufacturerOwnerName: json['manufacturerOwnerName'],
      manufacturerState: json['manufacturerState'],
      manufacturerDistrict: json['manufacturerDistrict'],
      batchId: json['batchId'],
      batchNumber: json['batchNumber'],
      batchQuantity: (json['batchQuantity'] as num?)?.toDouble(),
      batchQuantityUnit: json['batchQuantityUnit'],
      harvestDate: json['harvestDate'] != null ? DateTime.parse(json['harvestDate']) : null,
      batchLocation: json['batchLocation'],
      cultivationId: json['cultivationId'],
      herbName: json['herbName'],
      cultivationMethod: json['cultivationMethod'],
      plantingDate: json['plantingDate'] != null ? DateTime.parse(json['plantingDate']) : null,
      expectedHarvestDate: json['expectedHarvestDate'] != null ? DateTime.parse(json['expectedHarvestDate']) : null,
      cultivationLocation: json['cultivationLocation'],
      cultivationLatitude: (json['cultivationLatitude'] as num?)?.toDouble(),
      cultivationLongitude: (json['cultivationLongitude'] as num?)?.toDouble(),
      farmerDbId: json['farmerDbId'],
      farmerId: json['farmerId'],
      farmerName: json['farmerName'],
      farmerState: json['farmerState'],
      farmerDistrict: json['farmerDistrict'],
      farmerLatitude: (json['farmerLatitude'] as num?)?.toDouble(),
      farmerLongitude: (json['farmerLongitude'] as num?)?.toDouble(),
    );
  }
}
