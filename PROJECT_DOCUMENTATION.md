# AWS Route 53 Clone - Project Documentation

## Executive Summary
This project is a high-fidelity, full-stack web application clone of **Amazon Route 53**, AWS’s scalable Domain Name System (DNS) web service. It was designed to replicate the authentic AWS console experience, complete with complex data-tables, responsive layouts, mock IAM authentication, and a robust backend API for managing DNS records.

The application serves as a comprehensive showcase of modern full-stack engineering, demonstrating proficiency in React/Next.js, Python/FastAPI, relational database design, and UI/UX replication using the AWS Cloudscape design system.

---

## 1. System Architecture & Technology Stack

The application follows a decoupled **Client-Server Architecture**, allowing the frontend and backend to scale and operate independently. 

### 1.1 Frontend (Client-Side)
- **Framework:** Next.js 14 (App Router) with React
- **Language:** TypeScript for strong typing and error reduction
- **Styling:** Tailwind CSS (Customized to match AWS Cloudscape Design System)
- **Icons:** Lucide React
- **State Management:** React Context API (for Authentication and Global Notifications)

### 1.2 Backend (Server-Side)
- **Framework:** FastAPI (Python) - Chosen for its speed, automatic Swagger UI documentation, and native async support.
- **Language:** Python 3.x
- **Data Validation:** Pydantic v2 (Strict schema validation for incoming/outgoing API data)

### 1.3 Database Layer
- **Database Engine:** SQLite (Persistent disk-based storage via `route53.db`)
- **ORM:** SQLAlchemy (Object Relational Mapper for Python)
- **Integrity:** Enforces strict Foreign Key constraints and Cascade Deletions (deleting a hosted zone automatically cleans up orphan DNS records).

---

## 2. Key Features and Capabilities

### 2.1 Mock IAM Authentication
- Implements a simulated AWS Identity and Access Management (IAM) login session.
- Uses `AuthContext` to persist user sessions across page reloads using browser local storage and cookies.
- Protects internal routes (Dashboard, Hosted Zones) via Next.js middleware, securely redirecting unauthenticated users to the login screen.

### 2.2 Hosted Zone Management (Full CRUD)
- **Create:** Users can provision Public or Private hosted zones. The system automatically provisions default `NS` (Name Server) and `SOA` (Start of Authority) records upon creation.
- **Read:** A centralized table with search, pagination, and type-filtering. Includes derived fields like dynamic record counts.
- **Update:** Edit zone descriptions and metadata via modal dialogs.
- **Delete:** Supports single and bulk deletions. A warning prompt ensures users understand that associated DNS records will be permanently dropped.

### 2.3 DNS Resource Record Management
- Supports 9 standard Route 53 DNS record types: **A, AAAA, CNAME, TXT, MX, NS, SOA, PTR, SRV, and CAA**.
- Form validation ensures strict compliance with DNS routing policies and TTL (Time To Live) variables.
- Users can export all records of a specific hosted zone into a structured JSON file.

### 2.4 High-Fidelity UI & Responsiveness
- **Pixel-Perfect Clone:** Implements exact AWS hex colors (e.g., Ink `#0f141a`, Link `#0972d3`, Orange `#EC7211`).
- **Responsive Layouts:** Mobile-first approach. Navigation bars, data tables, and pagination controls dynamically wrap and adapt to smaller screens without horizontal overflow clipping.
- **Keyboard Shortcuts:** Global search interception via `Alt + S`.

---

## 3. Implementation Details

### 3.1 Database Schema Design
The relational database utilizes two primary tables connected by a One-to-Many relationship:
1. `hosted_zones`: Stores `id`, `name`, `caller_reference` (unique idempotency token), `comment`, and `private_zone` boolean.
2. `resource_records`: Stores `id`, `zone_id` (Foreign Key), `name`, `type`, `ttl`, `value`, and `routing_policy`.

### 3.2 State Management and Lifecycle
- **Dynamic Derived State:** The backend actively computes `record_set_count` during API fetch requests (`len(zone.records)`) rather than relying on brittle incremental counters, guaranteeing 100% data accuracy even after bulk deletions.
- **Global Toast Notifications:** A centralized `NotificationContext` provider intelligently queues and auto-dismisses success/error alerts with race-condition prevention.

### 3.3 API Endpoints
The FastAPI application exposes a fully documented RESTful API at `http://127.0.0.1:8000/docs`:
- `GET /api/hosted-zones` - Retrieve all zones
- `POST /api/hosted-zones` - Provision a new zone
- `GET /api/hosted-zones/{id}` - Fetch a zone and its nested records
- `DELETE /api/hosted-zones/{id}` - Delete a zone
- `POST /api/hosted-zones/{id}/records` - Create a DNS record
- `PUT /api/records/{id}` - Update a DNS record
- `DELETE /api/records/{id}` - Delete a DNS record

---

## 4. Running the Project Locally

To present this project on a local machine, two terminal processes must run concurrently:

**1. Start the Backend:**
```powershell
cd backend
# Activate virtual environment (if applicable)
.\venv\Scripts\Activate
pip install -r requirements.txt
uvicorn main:app --reload
```
*The backend will run on `http://127.0.0.1:8000`*

**2. Start the Frontend:**
```powershell
cd frontend
npm install
npm run dev
```
*The frontend will run on `http://localhost:3000`*

---

## 5. Future Scope and Extensibility
While this prototype successfully replicates the core workflow of Route 53, it sets a strong foundation for future enhancements:
1. **DNSSEC Integration:** Add actual cryptographic key signing to the currently mocked DNSSEC tab.
2. **Traffic Policies & Health Checks:** Implement visual traffic policy routing and endpoint monitoring dashboards.
3. **Multi-User RBAC:** Expand the mock IAM authentication into a real JWT-based Role-Based Access Control system (e.g., Admin vs Read-Only roles).

---

## Conclusion
This Route 53 clone is a testament to strong full-stack fundamentals, encompassing everything from database integrity and backend API design to responsive, pixel-perfect frontend engineering. It successfully handles edge cases (like bulk cascading deletions and state desyncs) while providing an intuitive, professional user experience that mirrors industry-standard enterprise software.
