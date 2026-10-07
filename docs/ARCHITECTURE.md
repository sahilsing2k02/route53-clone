# Architecture

## Frontend
- **Framework:** Next.js (TypeScript)
- **Styling:** Vanilla CSS (or Tailwind CSS if we decide to align with modern stacks, but we will focus on matching AWS UI exact styling). Given the prompt allows us to use Vanilla CSS for maximum flexibility, we will use plain CSS/SCSS or Tailwind depending on efficiency for AWS-like UI. We will use Tailwind for utility but customize colors.
- **State Management:** React Context / Hooks

## Backend
- **Framework:** FastAPI (Python)
- **API Architecture:** RESTful endpoints for Hosted Zones and Records.

## Database
- **Database:** SQLite
- **ORM:** SQLAlchemy (Python)

## Application Flow
User -> Next.js UI -> API Calls (Fetch) -> FastAPI Backend -> SQLite Database

## Directory Structure
```
root/
├── docs/            # Project documentation
├── frontend/        # Next.js application
└── backend/         # FastAPI application
```

## Boundaries
- UI components manage presentation only.
- API logic in frontend is abstracted into service functions.
- Backend routing routes requests to specific handler functions.
- Database operations are isolated in CRUD utilities in the backend.
