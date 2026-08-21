# Implementation Plan - Fix Cultivation Save Error (Foreign Key Constraint)

The user is experiencing a `DataIntegrityViolationException` when saving a cultivation in the farmer dashboard. The error is caused by a foreign key constraint in the database that references a redundant or legacy `farmers` table, while the application logic and current entity mappings use the `farmer_registration` table.

## User Review Required

> [!IMPORTANT]
> The fix involves modifying the database schema via a new Flyway migration. This will drop an incorrect foreign key constraint and remove redundant tables (`users`, `farmers`, `customers`) that are not used by the current JPA entities.

## Proposed Changes

### Backend (Spring Boot)

#### [NEW] [V3__fix_cultivation_foreign_key.sql](file:///D:/2027/backend/src/main/resources/db/migration/V3__fix_cultivation_foreign_key.sql)
- Drop the incorrect foreign key constraint `FK2u3o86ju1tqvyc2uad97ny0fh` from the `cultivations` table.
- Ensure the `farmer_id` column in `cultivations` correctly references `farmer_registration(id)` (if not already handled by the existing `FKs0b8ci6yacg5fvbangd4hx44`).
- Remove the redundant tables `farmers`, `customers`, and `users` to prevent future confusion, as the application now uses `farmer_registration` and `customer_registration` (which include all fields from the `@MappedSuperclass User`).

## Verification Plan

### Automated Tests
- Run the backend application to trigger Flyway migrations.
- Verify that the migrations apply successfully.

### Manual Verification
- Attempt to save a cultivation from the mobile app (or via Postman to `/api/farmer/cultivation`).
- Confirm that the `409 Conflict` (Data Integrity Violation) error no longer occurs and the cultivation is saved successfully.
- Verify in the database that the `cultivations` table now correctly references the `farmer_registration` table.
