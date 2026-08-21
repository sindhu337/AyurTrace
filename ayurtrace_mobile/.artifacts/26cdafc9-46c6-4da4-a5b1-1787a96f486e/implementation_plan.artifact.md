# Implementation Plan - Resolve Mobile Connectivity Issues

The user is experiencing connectivity issues between their Flutter app (`ayurtrace_mobile`) and a local backend server running on their Windows machine (`10.66.211.229:8080`). The provided screenshot shows the Windows Firewall settings, indicating that the firewall is likely blocking incoming requests from the mobile device.

## User Review Required

> [!IMPORTANT]
> The backend server must be running and listening on all network interfaces (`0.0.0.0`) or specifically on the LAN IP (`10.66.211.229`). If it is only listening on `localhost` or `127.0.0.1`, it will not be accessible from the mobile device even if the firewall is opened.

> [!WARNING]
> Your IP address `10.66.211.229` appears to be assigned by DHCP. If you restart your router or reconnect to Wi-Fi, this IP might change, requiring an update in [api_config.dart](file:///D:/2027/AYURTRACE/ayurtrace_mobile/lib/core/config/api_config.dart).

## Proposed Changes

We will fix this by allowing inbound traffic on port `8080` through the Windows Firewall.

### Firewall Configuration

#### [ACTION] Add Inbound Rule for Port 8080
We will use a PowerShell command to create a new firewall rule that allows incoming TCP traffic on port 8080 for the Private network profile.

```powershell
New-NetFirewallRule -DisplayName "Allow AyurTrace Backend (8080)" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow -Profile Private
```

## Verification Plan

### Manual Verification
1. **Check Backend Availability**: Run the backend server on the host machine.
2. **Ping Test**: Try to ping the host machine (`10.66.211.229`) from the mobile device (if a terminal app is available) or use a browser on the mobile device to visit `http://10.66.211.229:8080/api/products` (or any valid endpoint).
3. **Run App**: Launch the Flutter app on the physical device and check if data (like products) is fetched successfully.
4. **Logcat Monitoring**: Monitor logs for any `DioException` or `Connection refused` errors.
