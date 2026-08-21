class Product {
  final String id;
  final String name;
  final String description;
  final double price;
  final String imageUrl;
  final String category;
  final String? batchId;
  final String? manufacturerName;
  final int stockQuantity;

  Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.imageUrl,
    required this.category,
    this.batchId,
    this.manufacturerName,
    this.stockQuantity = 0,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id']?.toString() ?? '',
      name: json['name'] ?? 'Unknown Product',
      description: json['description'] ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      imageUrl: json['imageUrl'] ?? '',
      category: json['category'] ?? 'General',
      batchId: json['batchId']?.toString(),
      manufacturerName: json['manufacturerCompanyName'],
      stockQuantity: json['stockQuantity'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'price': price,
      'imageUrl': imageUrl,
      'category': category,
      'batchId': batchId,
      'manufacturerCompanyName': manufacturerName,
      'stockQuantity': stockQuantity,
    };
  }
}
