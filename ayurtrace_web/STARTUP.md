# AYURTRACE — Startup Guide

## Prerequisites
- Java 25 (installed at C:\Program Files\Java\jdk-25)
- MySQL 8 running at localhost:3306
- Node.js 22+

---

## 1. Start the Spring Boot Backend

```powershell
cd D:\2027\backend
$env:JAVA_HOME = "C:\Program Files\Java\jdk-25"
$env:PATH = "$env:JAVA_HOME\bin;" + $env:PATH
.\mvnw.cmd spring-boot:run
```

Backend starts at: http://localhost:8080

On first run:
- Creates all tables in `ayurtracedb` automatically (JPA ddl-auto=update)
- Seeds admin account: username=`ayurtrace`, password=`ayur8055`

---

## 2. Start the React Web Frontend

```powershell
cd D:\2027\AYURTRACE\ayurtrace_web
npm run dev
```

Opens at: http://localhost:3000

---

## 3. Login Credentials

### Admin
- URL: http://localhost:3000/admin/login
- Username: `ayurtrace`
- Password: `ayur8055`

### Manufacturer
- Register at: http://localhost:3000/manufacturer/register
- Admin must approve the application
- Login with generated ID (e.g. AYM000001) + password

### Farmer (Flutter app)
- Register via Flutter app
- Admin approves → FARM000001 generated
- Login via Flutter with FARM000001 + password

---

## 4. API Base URLs

| Client | URL |
|--------|-----|
| React (dev) | http://localhost:3000 → proxied to http://localhost:8080 |
| Flutter (LAN) | http://YOUR_LAPTOP_IP:8080 |
| Direct API | http://localhost:8080/api |

---

## 5. Key API Endpoints

```
POST /api/auth/admin/login
POST /api/auth/manufacturer/register
POST /api/auth/manufacturer/login
POST /api/auth/farmer/register
POST /api/auth/farmer/login
POST /api/auth/customer/register
POST /api/auth/customer/login

GET  /api/admin/dashboard
GET  /api/admin/farmers/applications
POST /api/admin/farmers/{id}/approve
POST /api/admin/manufacturers/{id}/approve

GET  /api/manufacturer/dashboard
POST /api/manufacturer/products/json
GET  /api/manufacturer/orders
POST /api/manufacturer/qr/generate/{productId}

GET  /api/traceability/{qrId}     ← public, used by Flutter customer
GET  /api/customer/products       ← public, used by Flutter customer
```

---

## 6. File Uploads

Uploaded files stored at: `D:\2027\backend\uploads\`
Served at: `http://localhost:8080/uploads/`

Sub-directories:
- `uploads/licenses/` — AYUSH license documents
- `uploads/products/` — product images
- `uploads/qr/` — generated QR PNG files
