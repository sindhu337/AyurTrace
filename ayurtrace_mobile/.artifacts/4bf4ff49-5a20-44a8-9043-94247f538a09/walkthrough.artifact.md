# Walkthrough — Physical Device & Backend Integration

I have updated the Ayurtrace mobile application to be fully functional on a **physical Android phone** and aligned all API endpoints with your existing **Spring Boot backend**.

## Key Changes

### 1. Centralized Networking
- **File**: [api_config.dart](file:///D:/2027/AYURTRACE/ayurtrace_mobile/lib/core/config/api_config.dart)
- I hardcoded your laptop's LAN IP (`10.66.211.229`) in a centralized configuration.
- All endpoints for Farmers, Customers, and Traceability have been verified against your Spring Boot controllers.

### 2. Physical Device Connection Fixes
- **File**: [auth_provider.dart](file:///D:/2027/AYURTRACE/ayurtrace_mobile/lib/features/auth/auth_provider.dart)
- Improved error messages specifically for physical devices (e.g., reminding the user to check if the phone is on the same Wi-Fi as the laptop).
- Ensured `android:usesCleartextTraffic="true"` is enabled for local HTTP development.

### 3. Actor Implementation Alignment
- **Farmer Service**: Updated to use correct plural/singular paths (`/cultivation` vs `/cultivations`) and fixed batch creation to use query parameters (`?cultivationId=...`) as required by the backend.
- **Customer Service**: Fixed product search, cart operations, and ordering. Cart endpoints now use `@RequestParam` instead of JSON bodies where applicable.
- **Traceability**: Created a new `TraceabilityResponse` model to match the detailed, flat DTO returned by the backend and refactored the UI to display the full product journey.

## How to Test on Physical Phone

> [!IMPORTANT]
> 1. Ensure your laptop and phone are on the **same Wi-Fi network**.
> 2. Verify that **Spring Boot** is running on your laptop.
> 3. Verify your laptop's IP is still `10.66.211.229` (run `ipconfig`). If it changed, update `laptopIp` in [api_config.dart](file:///D:/2027/AYURTRACE/ayurtrace_mobile/lib/core/config/api_config.dart).
> 4. Connect your phone via USB and run:
>    ```bash
>    flutter run
>    ```

## Verification Steps

### Farmer Flow
1. Register a new Farmer.
2. Approve the farmer in the **React Admin Web App**.
3. Login using the generated **Farmer ID** and password.
4. Add a cultivation and create a batch.

### Customer Flow
1. Register and Login as a Customer.
2. Browse products (verify they match the Manufacturer's entries).
3. Add to cart and Checkout.
4. **Scan a QR code** (e.g., from the Manufacturer Web app) and verify the detailed traceability timeline appears.

> [!TIP]
> If you encounter a "Connection error," tap the **Network Check** icon (top right of the Register screen) to see a detailed error message including the URL being attempted.
