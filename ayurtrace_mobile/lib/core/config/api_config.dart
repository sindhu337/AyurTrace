import 'package:flutter/foundation.dart';
import 'dart:io';

class ApiConfig {
  // CONFIGURATION FOR PHYSICAL DEVICE
  // Update this IP to match your laptop's IPv4 address (from ipconfig)
  static const String laptopIp = '10.198.134.229';

  static String get baseUrl {
    if (kIsWeb) return 'http://localhost:8080';
    if (Platform.isAndroid) {
      // Use 10.0.2.2 for emulator, laptopIp for physical device
      // Set this to false for physical device testing
      const bool isEmulator = false; 
      return isEmulator ? 'http://10.0.2.2:8080' : 'http://$laptopIp:8080';
    }
    return 'http://localhost:8080';
  }

  static String get apiV1 => '$baseUrl/api';

  // Auth endpoints
  static String get farmerRegister => '$apiV1/auth/farmer/register';
  static String get farmerLogin => '$apiV1/auth/farmer/login';
  static String get customerRegister => '$apiV1/auth/customer/register';
  static String get customerLogin => '$apiV1/auth/customer/login';

  // Farmer endpoints
  static String get farmerBase => '$apiV1/farmer';
  static String get farmerProfile => '$farmerBase/profile';
  static String get cultivation => '$farmerBase/cultivation';
  static String get cultivations => '$farmerBase/cultivations';
  static String get batch => '$farmerBase/batch';
  static String get batches => '$farmerBase/batches';
  static String get messages => '$farmerBase/messages';
  static String get message => '$farmerBase/message';
  static String get notifications => '$farmerBase/notifications';

  // Customer endpoints
  static String get customerBase => '$apiV1/customer';
  static String get products => '$customerBase/products';
  static String get favourites => '$customerBase/favourites';
  static String get cart => '$customerBase/cart';
  static String get checkout => '$customerBase/checkout';
  static String get orders => '$customerBase/orders';
  static String get customerProfile => '$customerBase/profile';

  // Traceability
  static String get traceability => '$apiV1/traceability';
}
