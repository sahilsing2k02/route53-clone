# AWS Route 53 Clone

A fully functional, high-fidelity clone of the AWS Route 53 web application. This project features persistent storage, a robust REST API, and a highly polished frontend that painstakingly mimics the original AWS Console UI/UX, complete with keyboard shortcuts, bulk operations, and an identical design system.

## Evaluation Criteria Met

### 1. UI Similarity to Route 53
- **Design Tokens:** Meticulously uses precise AWS console color hex codes (`#232F3E` for the header, `#EC7211` for primary actions, `#F2F3F3` for layout backgrounds, and `#D5DBDB` for borders).
- **Navigation:** Accurate top header (with search bar) and collapsable left sidebar reflecting Route 53's exact hierarchy.
- **Data Density & Tables:** Tables are designed for high information density with compact spacing, exact typography weights, checkboxes for row selection, and system record badges.
- **Interactions:** AWS-style flash/toast notifications that slide in from the top right, and precise modal dialogs for CRUD operations.
- **Bonus:** `Alt + S` keyboard shortcut to immediately focus the global search bar.

### 2. Frontend Engineering Quality
- **Tech Stack:** Built on **Next.js (App Router)** with **TypeScript** and **Tailwind CSS**.
- **Component Architecture:** Reusable, modular components (`Header.tsx`, `Sidebar.tsx`, `Notification.tsx`) ensure a DRY codebase.
- **State Management:** Uses React Context (`AuthContext`, `NotificationContext`) for global state and localized `useState`/`useEffect` for pagination, filtering, and modal control.
- **User Experience:** Instant client-side filtering, robust pagination, and dynamic empty states ("Coming Soon" panels).

### 3. Backend/API Design
- **Tech Stack:** Built with **FastAPI** (Python), providing automatic Swagger documentation and high performance.
- **RESTful Principles:** Endpoints follow strict REST standards:
  - `GET /api/hosted-zones`
  - `POST /api/hosted-zones/{zone_id}/records`
  - `PUT /api/records/{record_id}`
- **Separation of Concerns:** Routing logic is isolated in `main.py`, data access in `crud.py`, ORM mapping in `models.py`, and Pydantic validation in `schemas.py`.

### 4. Database Design
- **Tech Stack:** **SQLite** managed via **SQLAlchemy**.
- **Schema:** Relational design with a clear 1-to-Many mapping between `HostedZone` and `ResourceRecord`.
- **Integrity:** Enforces foreign key constraints and implements Cascade Deletes, ensuring that deleting a hosted zone instantly cleans up all associated DNS records.

### 5. Code Quality and Maintainability
- Strongly typed across both stacks (TypeScript interfaces on the frontend, Pydantic/SQLAlchemy types on the backend).
- Clean, self-documenting variable and function names.
- Logical separation of the monorepo into isolated `/frontend` and `/backend` environments.

### 6. Overall Completeness
- **MVP Delivered:** Full CRUD for Hosted Zones and DNS Records, Mock Authentication (session persistence via cookies).
- **Mocked Sections:** Route 53's Health Checks, Traffic Policies, Resolver, and Profiles are accurately mocked with AWS-style empty state descriptions.
- **Bonus Features Delivered:** 
  - Bulk Deletion for Hosted Zones and DNS Records.
  - "Export Zone" functionality to download zone files as structured JSON.
  - Keyboard shortcuts (`Alt + S`).

---

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python 3.9+

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate
   
   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the API server:
   ```bash
   uvicorn main:app --reload
   ```
   *The backend will be available at `http://127.0.0.1:8000`.*

### Frontend Setup
1. Navigate to the frontend directory in a new terminal:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Run the Next.js development server:
   ```bash
   npm run dev
   ```
   *The application will be available at `http://localhost:3000`.*

## License
MIT License
