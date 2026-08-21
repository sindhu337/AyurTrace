# Urgent Debugging: Farmer & Customer Registration DioException

This plan focuses on identifying and fixing the `DioException` occurring during registration on a physical Android phone.

## User Review Required

> [!IMPORTANT]
> I have verified that the laptop IP (`10.66.211.229`) and the backend port (`8080`) are correctly configured in the Flutter app. The backend is also listening on all interfaces (`0.0.0.0`).
>
> The error might be caused by:
> 1. **Windows Firewall**: Blocking the phone from accessing port 8080.
> 2. **DTO Mismatch**: Fields sent from Flutter not matching what Spring Boot expects.
> 3. **Database Constraints**: Validation failing on the server side (e.g., duplicate entries).

## Proposed Changes

### 1. Enhanced Logging (Flutter)

#### [MODIFY] [auth_provider.dart](file:///D:/2027/AYURTRACE/ayurtrace_mobile/lib/features/auth/auth_provider.dart)
- Update `register` and `login` methods to print the full `DioException` details (URL, Body, Status, Error Message) to the console. This will allow us to see exactly what the server is returning.

---

### 2. Connectivity Test (Manual Action)

- I will ask you to open the Chrome browser on your **Android phone** and go to: `http://10.66.211.229:8080/api/auth/ping`.
- If you see "Backend is reachable!", the network is fine, and the issue is likely in the data (DTO/Database).
- If you see "This site can't be reached", the issue is **Windows Firewall** or network routing.

---

### 3. Backend Verification

#### [MODIFY] [AuthService.java](file:///D:/2027/backend/src/main/java/com/ayurtrace/service/AuthService.java)
- Ensure registration methods return a clear 409 Conflict if a user already exists, or 400 Bad Request if data is invalid.
- Verify that `BCrypt` is correctly hashing passwords.

---

### 4. Database Alignment

- Verify that the `farmer_registration` and `customer_registration` tables have the correct columns and lengths to accommodate the data being sent.

## Verification Plan

### Automated Tests
- Monitor backend logs during registration for any Hibernate exceptions.
- Run `flutter run` and check the debug console for detailed Dio logs.

### Manual Verification
1. **Connectivity Check**: Open `ping` URL on phone.
2. **Registration Test**: Try registering with a **new, unique email and mobile number** to avoid "Already in use" errors.
3. **Database Check**: Run `SELECT * FROM farmer_registration` after a "successful" attempt.
