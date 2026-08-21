# Implementation Plan - Virtual Device & Debugging Setup

The user wants a "virtual phone type display" to debug errors before deploying to a physical device. This plan focuses on setting up the Android Emulator, integrating the `device_preview` package for UI testing, and configuring the API to work seamlessly in a virtual environment.

## User Review Required

> [!IMPORTANT]
> To use the "virtual phone" (Android Emulator) with your local backend, we need to update the API address to `10.0.2.2`. This is a special alias that allows the emulator to communicate with your computer's `localhost`.

## Proposed Changes

### 1. Flutter Configuration

#### [MODIFY] [pubspec.yaml](file:///D:/2027/AYURTRACE/ayurtrace_mobile/pubspec.yaml)
- Add `device_preview: ^1.2.0` to dependencies. This package provides a virtual phone frame around your app and lets you test different screen sizes and locales.

#### [MODIFY] [main.dart](file:///D:/2027/AYURTRACE/ayurtrace_mobile/lib/main.dart)
- Wrap the root app with `DevicePreview`.
- Configure `MaterialApp.router` to use `DevicePreview`'s locale and builder.

### 2. Network Configuration

#### [MODIFY] [api_config.dart](file:///D:/2027/AYURTRACE/ayurtrace_mobile/lib/core/config/api_config.dart)
- Implement a helper to automatically detect if the app is running on an emulator and switch the `baseUrl` to `10.0.2.2`.

---

## Verification Plan

### Manual Verification
1.  **Launch Emulator**: Guide the user to open the **Device Manager** in Android Studio and start an AVD (Android Virtual Device).
2.  **Run App**: Run the app on the emulator and verify that the `DevicePreview` frame appears.
3.  **Test Connectivity**: Verify that the app can connect to the backend using the dynamic IP switching.
4.  **Debug Errors**: Use the **Flutter Inspector** and **Logcat** to view logs and UI hierarchy.
