# Tasks: Ayurtrace Mobile — Physical Device Integration

## Phase 1: Core Networking & Configuration
- [x] Centralize API base paths in `ApiConfig` `[lib/core/config/api_config.dart]`
- [x] Refine `DioClient` logging and configuration `[lib/core/network/dio_client.dart]`

## Phase 2: Authentication & Authorization
- [x] Improve `AuthProvider` error handling for physical devices `[lib/features/auth/auth_provider.dart]`

## Phase 3: Farmer Actor Implementation
- [x] Align `FarmerService` endpoints with backend `[lib/services/farmer_service.dart]`
- [x] Fix Farmer registration fields in `RegisterScreen` `[lib/features/auth/register_screen.dart]`
- [x] Fix Batch creation logic (query params) `[lib/services/farmer_service.dart]`

## Phase 4: Customer Actor Implementation
- [x] Align `CustomerService` endpoints with backend `[lib/services/customer_service.dart]`
- [x] Align `ProductService` endpoints with backend `[lib/services/product_service.dart]`
- [x] Fix Cart/Order flows to match backend controllers

## Phase 5: Traceability & QR Scanning
- [x] Create `TraceabilityResponse` model `[lib/models/traceability_response.dart]`
- [x] Update `TraceabilityService` to return `TraceabilityResponse` `[lib/services/traceability_service.dart]`
- [x] Refactor `TraceabilityTimelineScreen` to use detailed response `[lib/features/traceability/traceability_timeline_screen.dart]`

## Phase 6: Final Verification
- [x] Check Android permissions and cleartext settings `[android/app/src/main/AndroidManifest.xml]`
- [x] Stabilize Build environment (JDK Downgrade/Bundled JDK)
- [/] End-to-end testing on physical device
