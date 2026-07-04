# NIROFLIXX PLATFORM — API SPECIFICATION v1.0

Base URL: `http://localhost:5000/api/v1`

---

## Authentication

All protected routes require: `Cookie: token=<jwt>` (HTTP Only)

---

## Standard Response Envelope

### Success
```json
{
  "status": "success",
  "message": "Operation successful",
  "data": {},
  "pagination": { "page": 1, "limit": 12, "total": 100, "totalPages": 9 }
}