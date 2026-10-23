AyurTrace 🌿
Blockchain-Based Geo-Tagged Traceability for Ayurvedic Medicinal Herbs
AyurTrace is a digital traceability platform designed to improve
transparency across the Ayurvedic medicinal-herb supply chain. It aims
to connect cultivation, batch management, manufacturing, and customer
verification so that product provenance can be followed from farm to
final product.
Project status: Student project in development. Features and
integrations may vary by module. Do not treat planned integrations as
production-ready until implemented and tested.

Key Features
- Farmer interface: Record cultivation and herb/batch information.
- Manufacturer interface: Support manufacturer workflows and
  batch/product operations.
- Admin portal: Administrative views for managing and monitoring
  platform information.
- Customer verification: Customer-facing product traceability
  using QR codes, where configured.
- Geo-tagging: Associate herb records with cultivation locations.
- Supply-chain traceability: Maintain digital records of relevant
  stages from cultivation to product verification.
- Responsive UI: Web pages designed for desktop and mobile
  screens.
Project Modules
  Module                    Purpose                 Technology
  frontend-admin          Admin portal            React / Material UI
                                                    (existing setup)

  frontend-customer       Customer-facing portal  Confirm from the module
                                                    configuration

  frontend-manufacturer   Manufacturer portal     Confirm from the module
                                                    configuration

  frontend-farmer         Farmer mobile           Flutter / Dart
                            application             

  backend                 Server-side API and     Spring Boot, Java,
                            application logic       Spring Data JPA
  Database                  Application persistence MySQL 8
Hyperledger Fabric is part of the project's traceability direction.
Confirm its setup and chaincode configuration before describing it as an
active integration.
Technology Stack
- Backend: Java 23, Spring Boot 3.4.1, Spring Data JPA
- Database: MySQL 8
- Admin frontend: React and Material UI
- Farmer application: Flutter and Dart
- Traceability direction: QR-based verification, geo-tagging, and
  blockchain integration where implemented
Repository Structure
ayurtrace/
├── backend/
│   ├── src/
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
├── frontend-admin/
├── frontend-customer/
├── frontend-farmer/
└── frontend-manufacturer/
This is an indicative structure. Use the actual directory names in your
repository if they differ.
Prerequisites
Install the tools needed for the modules you want to run:
- Java Development Kit (JDK) 23, matching the backend's configured
  Java version
- MySQL 8
- Git
- Node.js and npm, if the web frontends use a Node-based build
- Flutter SDK and Android tooling, if running the farmer app
Getting Started
1. Clone the repository
Replace the placeholders with your GitHub repository URL and folder
name.
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <YOUR_REPOSITORY_FOLDER>
2. Configure MySQL
1. Start the MySQL service.
2. Create the database expected by your local backend configuration.
3. Create or configure a database user with the required privileges.
4. Configure the database connection using environment variables or a
   local, untracked configuration file.
Never commit database passwords, JWT secrets, API keys, or other
credentials to GitHub. If a secret was previously committed or shared,
rotate it and remove it from repository history as appropriate.
3. Run the backend
Open a terminal in the backend directory.

On Windows PowerShell:
.\mvnw.cmd clean
.\mvnw.cmd spring-boot:run
On macOS/Linux:
chmod +x ./mvnw
./mvnw clean
./mvnw spring-boot:run
The backend is configured to use port 8080 in the current project
setup. If startup fails, check the database connection, credentials,
Java version, and application logs.
4. Run a web frontend
Open a terminal in the relevant frontend directory, for example:
cd frontend-admin
npm install
npm run dev
Use the scripts defined in that frontend's package.json. Some projects
use npm start or another command instead of npm run dev.

Repeat for other web frontend modules as needed.
5. Run the farmer application
Open frontend-farmer in Android Studio or VS Code with the Flutter
extension. Then run:
flutter pub get
flutter run
Ensure the app's API base URL points to a backend address reachable from
the emulator or device. An Android emulator may require a different host
address than localhost.
Configuration and Security
- Keep secrets in environment variables or local configuration files
  excluded from version control.
- Commit a sanitized .env.example or configuration example with
  placeholder values only.
- Never publish real passwords, signing keys, JWT secrets, private
  certificates, or personal data.
- Configure CORS, authentication, and authorization for the deployment
  environment.
- Use HTTPS and production-grade secret management before deploying
  publicly.
- Do not rely on a frontend role selector for access control;
  authorization must be enforced by the backend.
Development Notes
- Preserve existing API contracts when making frontend UI changes.
- Test login, registration, role-specific navigation, and QR
  traceability against the actual backend.
- Verify that any blockchain integration is configured and working
  before claiming records are stored on a live ledger.
- Add screenshots or a demo video once the current UI is stable.
- Document any required Hyperledger Fabric network, channel,
  chaincode, or service configuration if it is part of the active
  implementation.
Future Enhancements
Potential areas for further development include:
- End-to-end traceability from cultivation to finished product
- QR-based product provenance verification
- Geospatial visualization of cultivation records
- Supply-chain analytics and reporting
- Integration and verification of blockchain-backed records
- Improved accessibility and responsive user experience
These are proposed directions, not a guarantee that every feature is
currently implemented.
Contributing
1. Create a feature branch.
2. Make focused changes within the relevant module.
3. Test the affected module and its integrations.
4. Keep secrets and local configuration out of commits.
5. Open a pull request with a clear summary and testing notes.
License
No license has been specified. Add a LICENSE file and update this
section once the project owners decide how the code may be used,
modified, and redistributed.
AyurTrace --- From Farm to Formulation 🌱
