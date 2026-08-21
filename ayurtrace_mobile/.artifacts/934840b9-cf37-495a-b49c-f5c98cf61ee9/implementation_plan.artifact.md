# Implementation Plan - Fix Farmer Registration Connectivity

The user is experiencing a `DioExceptionType.unknown` error when trying to register as a Farmer from a physical phone. My investigation shows that the backend is running and reachable from the computer itself, but the phone is unable to get a response, likely due to network configuration or firewall issues.

## User Review Required

> [!IMPORTANT]
> **Firewall Configuration:** Windows Firewall often blocks incoming connections on port 8080 by default. You may need to manually allow port 8080 or the Java executable in your firewall settings.

> [!NOTE]
> **Network Connectivity:** Ensure that your phone and computer are on the same Wi-Fi network and that your phone can "see" your computer's IP.

## Proposed Changes

### Mobile App (Flutter)

#### [MODIFY] [auth_provider.dart](file:///D:/2027/AYURTRACE/ayurtrace_mobile/lib/features/auth/auth_provider.dart)
- Improve error reporting to capture and display the underlying exception message.
- Add specific handling for `SocketException` to provide clearer guidance to the user.

#### [MODIFY] [register_screen.dart](file:///D:/2027/AYURTRACE/ayurtrace_mobile/lib/features/auth/register_screen.dart)
- Remove the `role` field from the registration payload to ensure it perfectly matches the backend DTO.
- Add basic validation for email and mobile number formats.

### Backend (Spring Boot)

#### [MODIFY] [AuthController.java](file:///D:/2027/backend/src/main/java/com/ayurtrace/controller/AuthController.java)
- Add a simple "health check" endpoint at `/api/auth/ping` to allow testing connectivity without a full registration payload.

#### [MODIFY] [application.properties](file:///D:/2027/backend/src/main/resources/application.properties)
- Enable more verbose logging for web requests to help debug incoming connections (if the user can see logs).

## Verification Plan

### Manual Verification
- **Connectivity Ping:** Use the new `/api/auth/ping` endpoint from the mobile app to verify the phone can reach the server.
- **Detailed Error Logging:** Attempt registration again and check the updated error messages in the app UI and Logcat.
- **Payload Match:** Verify that the backend receives the registration request (if firewall issues are resolved).
