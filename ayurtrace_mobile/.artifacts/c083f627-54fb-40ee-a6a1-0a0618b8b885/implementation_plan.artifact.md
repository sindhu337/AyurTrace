# Fix Build Errors in ayurtrace_mobile

The project is currently failing to build due to a missing import and type mismatches in the Farmer Dashboard.

## Proposed Changes

### Traceability Feature

#### [MODIFY] [traceability_timeline_screen.dart](file:///D:/2027/AYURTRACE/ayurtrace_mobile/lib/features/traceability/traceability_timeline_screen.dart)
- Update the import from `../../models/traceability.dart` to `../../models/traceability_event.dart`.
- This will resolve the file not found error and the `TraceabilityEvent isn't a type` error.

### Farmer Feature

#### [MODIFY] [farmer_dashboard.dart](file:///D:/2027/AYURTRACE/ayurtrace_mobile/lib/features/farmer/farmer_dashboard.dart)
- Call `.toJson()` on the `Cultivation` object passed to `FarmerService.addCultivation`.
- Call `.toJson()` on the `Batch` object passed to `FarmerService.createBatch`.
- This will resolve the type mismatch errors as `FarmerService` expects `Map<String, dynamic>`.

## Verification Plan

### Automated Tests
- Run `flutter build apk` or `flutter run` to verify that the build succeeds.

### Manual Verification
- Verify that the Traceability screen still works (if mock data is available).
- Verify that adding a cultivation and creating a batch still works.
