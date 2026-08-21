import 'user.dart';

class Customer extends User {
  final String gender;
  final DateTime dob;
  final String address;
  final String state;
  final String district;
  final String pincode;

  Customer({
    required super.id,
    required super.username,
    required super.fullName,
    required super.email,
    required super.mobile,
    required this.gender,
    required this.dob,
    required this.address,
    required this.state,
    required this.district,
    required this.pincode,
  }) : super(role: UserRole.customer);

  factory Customer.fromJson(Map<String, dynamic> json) {
    return Customer(
      id: json['id'],
      username: json['username'],
      fullName: json['fullName'],
      email: json['email'],
      mobile: json['mobile'],
      gender: json['gender'],
      dob: DateTime.parse(json['dob']),
      address: json['address'],
      state: json['state'],
      district: json['district'],
      pincode: json['pincode'],
    );
  }

  @override
  Map<String, dynamic> toJson() {
    final val = super.toJson();
    val.addAll({
      'gender': gender,
      'dob': dob.toIso8601String(),
      'address': address,
      'state': state,
      'district': district,
      'pincode': pincode,
    });
    return val;
  }
}
