# AWS Route53 Clone

A functional clone of the AWS Route53 web application featuring persistent storage, a backend API, and a frontend that mimics the original UI/UX.

## Architecture Overview

- **Frontend:** Next.js (TypeScript, App Router, Tailwind CSS)
- **Backend:** FastAPI (Python)
- **Database:** SQLite + SQLAlchemy

## Setup Instructions

### Prerequisites
- Node.js
- Python 3.9+

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend API will run on `http://127.0.0.1:8000`.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The application will run on `http://localhost:3000`.

## Features
- **Mock Authentication:** Simple session handling (placeholder).
- **Hosted Zones:** Full CRUD functionality.
- **DNS Records:** Full CRUD functionality for records within hosted zones.

## Documentation
Please refer to the `docs/` directory for detailed requirements, architecture, and design decisions.
