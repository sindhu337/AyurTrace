import 'user.dart';

class Farmer extends User {
  final String farmerId;
  final String aadhaar;
  final String rtc;
  final String address;
  final String state;
  final String district;
  final String pincode;
  final String gps;

  Farmer({
    required super.id,
    required super.username,
    required super.fullName,
    required super.email,
    required super.mobile,
    required this.farmerId,
    required this.aadhaar,
    required this.rtc,
    required this.address,
    required this.state,
    required this.district,
    required this.pincode,
    required this.gps,
  }) : super(role: UserRole.farmer);

  factory Farmer.fromJson(Map<String, dynamic> json) {
    return Farmer(
      id: json['id'],
      username: json['username'],
      fullName: json['fullName'],
      email: json['email'],
      mobile: json['mobile'],
      farmerId: json['farmerId'],
      aadhaar: json['aadhaar'],
      rtc: json['rtc'],
      address: json['address'],
      state: json['state'],
      district: json['district'],
      pincode: json['pincode'],
      gps: json['gps'],
    );
  }

  @override
  Map<String, dynamic> toJson() {
    final val = super.toJson();
    val.addAll({
      'farmerId': farmerId,
      'aadhaar': aadhaar,
      'rtc': rtc,
      'address': address,
      'state': state,
      'district': district,
      'pincode': pincode,
      'gps': gps,
    });
    return val;
  }
}
