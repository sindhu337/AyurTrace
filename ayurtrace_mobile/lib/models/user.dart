enum UserRole { farmer, customer, admin }

class User {
  final String id;
  final String username;
  final String fullName;
  final String email;
  final String mobile;
  final UserRole role;

  User({
    required this.id,
    required this.username,
    required this.fullName,
    required this.email,
    required this.mobile,
    required this.role,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      username: json['username'],
      fullName: json['fullName'],
      email: json['email'],
      mobile: json['mobile'],
      role: UserRole.values.firstWhere((e) => e.toString() == 'UserRole.${json['role']}'),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'fullName': fullName,
      'email': email,
      'mobile': mobile,
      'role': role.toString().split('.').last,
    };
  }
}
