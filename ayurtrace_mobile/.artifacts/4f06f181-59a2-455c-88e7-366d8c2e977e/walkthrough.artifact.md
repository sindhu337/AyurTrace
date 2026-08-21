# Walkthrough - Farmer Registration Fix

I have implemented fixes to ensure that farmer registration data is correctly persisted in the MySQL database and to provide better visibility into the backend process.

## Changes Made

### Backend (Spring Boot)

#### 1. [AuthService.java](file:///D:/2027/backend/src/main/java/com/ayurtrace/service/AuthService.java)
- **Problem**: The `User` table has a `UNIQUE` constraint on the `username` column, but it was not being set for farmers.
- **Solution**: Added `farmer.setUsername(request.getEmail())` as a default.
- **Enhancement**: Added `try-catch` blocks and `System.out.println` logs to track the database `save()` operation.

#### 2. [application.properties](file:///D:/2027/backend/src/main/resources/application.properties)
- **Enhancement**: Enabled `format_sql` and `TRACE` level logging for JDBC bindings. This allows you to see the exact SQL queries and values being sent to MySQL in your Spring Boot console.

### Mobile (Flutter)

#### 3. [api_config.dart](file:///D:/2027/AYURTRACE/ayurtrace_mobile/lib/core/config/api_config.dart)
- **Enhancement**: Added guidance comments regarding IP address configuration for physical device testing.

---

## Verification Steps

### 1. Check your Database
Run these SQL queries in your MySQL terminal or tool (e.g., MySQL Workbench):

```sql
-- Select your database
USE ayurtracedb;

-- Check if the user record exists
SELECT * FROM users WHERE email = 'your_registered_email@example.com';

-- Check if the farmer record exists (linked by user_id)
SELECT * FROM farmers;
```

### 2. Monitor Backend Logs
When you click "REGISTER" on your phone, look at the IntelliJ console where the Spring Boot app is running. You should see:
1. `Registration attempt for Farmer: ...`
2. `Saving farmer to database: ...`
3. The SQL `insert into users ...` and `insert into farmers ...` statements.
4. `Farmer saved successfully with ID: ...`

### 3. Approve the Farmer
Note that new farmers are registered with a `PENDING` status. To log in, you must approve them first. You can use a tool like Postman or `curl` to call the approval endpoint:

```bash
# Replace {id} with the ID shown in the backend logs
curl -X POST http://localhost:8080/api/auth/farmer/approve/{id}
```

> [!TIP]
> If you still don't see data in the database, check the **Spring Boot console** for any "Database error" or "Duplicate entry" messages.
