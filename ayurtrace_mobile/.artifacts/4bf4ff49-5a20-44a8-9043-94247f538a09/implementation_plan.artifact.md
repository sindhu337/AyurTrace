# Fix Build Crash & Environment Stabilization

I have analyzed the screenshots for both the **Mobile** and **Backend** projects. Both are currently configured to use **JDK 25**.

## User Review Required

> [!IMPORTANT]
> **JDK 25** is too new for the current Android build tools (Gradle/AGP), which is the direct cause of the `AndroidLocationsBuildService` and `AndroidDirectoryCreator` crashes.
>
> Furthermore, your backend `pom.xml` specifically targets **Java 17**. Using JDK 25 for a Java 17 project can lead to unpredictable behavior.

## Proposed Changes

### 1. Stabilize Mobile Build
I will force the mobile build to use the **Android Studio Bundled JDK** (which is based on JDK 17/21). This is the most reliable way to fix the Gradle crashes without affecting your other projects.

### 2. Backend Recommendation
> [!TIP]
> I strongly recommend switching the **Backend SDK** in IntelliJ from 25 to **JDK 17** or **JDK 21** to match your `pom.xml` requirements. This will ensure your Spring Boot app runs in a supported environment.

### 3. Execution Path
I will use a specific environment override to run the Flutter app on your physical device using the stable bundled JDK.

## Verification Plan

### Automated Verification
- Run `flutter run -d 10BD4N0DQG000PX` with the `JAVA_HOME` pointed to the stable Android Studio JBR.
- Verify the app compiles and deploys to your phone.

### Manual Verification
- You will see the **Ayurtrace** home screen on your phone.
- Registration and Login should work as long as the backend is also running.
