# Walkthrough - Virtual Device & Debugging Setup

I have successfully set up the virtual debugging environment for the AyurTrace mobile app. This allows you to test the app on multiple screen sizes and connect to your local backend from an emulator.

## Changes Made

### 1. UI Virtualization
- Added `device_preview` to `pubspec.yaml`.
- Integrated `DevicePreview` in [main.dart](file:///D:/2027/AYURTRACE/ayurtrace_mobile/lib/main.dart).
- Updated the app to react to the virtual device's locale and media queries.

### 2. Networking
- Updated [api_config.dart](file:///D:/2027/AYURTRACE/ayurtrace_mobile/lib/core/config/api_config.dart) with dynamic IP switching.
- **Emulator Mode**: Automatically uses `10.0.2.2` when running on an Android emulator.
- **Physical Device**: Retains your existing IP `10.66.211.229`.

### 3. Dependency Management
- Upgraded `intl` to `^0.20.3` to resolve a version conflict with the new debugging tools.

---

## How to use the Virtual Phone

### Step 1: Launch the Emulator
1. In Android Studio, go to **Tools** > **Device Manager**.
2. Click the **Play** button next to any existing AVD (Android Virtual Device).
3. If you don't have one, click **Create Device** and follow the wizard to install a phone image (e.g., Pixel 7).

### Step 2: Run the App
1. Ensure the emulator is selected as the target device in the bottom toolbar.
2. Press **F5** or click the **Run** button.
3. You will see a phone frame around your app. You can use the sidebar to change device types, orientations, and even simulate dark mode.

### Step 3: Switch to Physical Device
If you want to test on your real phone again:
1. Open [api_config.dart](file:///D:/2027/AYURTRACE/ayurtrace_mobile/lib/core/config/api_config.dart).
2. Change `const bool isEmulator = true;` to `false`.

> [!TIP]
> Use the **Flutter Inspector** in the sidebar of Android Studio to see the exact UI layout and debug overflow errors.
