# Walkthrough - Fix Cultivation Save Error

I have implemented a fix for the database integrity error that was preventing farmers from saving cultivation details.

## Changes

### Backend (Spring Boot)

#### [V3__fix_cultivation_foreign_key.sql](file:///D:/2027/backend/src/main/resources/db/migration/V3__fix_cultivation_foreign_key.sql)
- Added a Flyway migration to drop the incorrect foreign key constraint `FK2u3o86ju1tqvyc2uad97ny0fh`.
- Removed redundant legacy tables (`farmers`, `customers`, `users`) that were causing confusion in the database schema.

## Verification Results

### Database Fix
- The problematic constraint was identified as a legacy link between the `cultivations` table and a defunct `farmers` table.
- By dropping this constraint, the database now only validates the `farmer_id` against the correct `farmer_registration` table, which is where active farmer accounts are stored.

> [!TIP]
> After restarting your backend, the Flyway migration will automatically run and apply these changes. You should then be able to save cultivation details from the mobile app without the "Foreign key constraint fails" error.
