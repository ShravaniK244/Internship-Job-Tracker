# Job Tracker — Backend API

Production-ready REST API for the Internship/Job Tracker System.
Built with **Node.js**, **Express.js**, **MongoDB** (Mongoose), and **JWT authentication**.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# 3. Start in development mode (auto-restart on changes)
npm run dev

# 4. Start in production
npm start
```

Server runs on: `http://localhost:5000`

---

## Project Structure

```
server/
├── config/
│   └── db.js                 # MongoDB connection
├── models/
│   ├── User.js               # User schema (bcrypt pre-save hook)
│   └── Job.js                # Job schema (user reference, status enum)
├── controllers/
│   ├── authController.js     # register, login, getMe
│   └── jobController.js      # getJobs, getJob, createJob, updateJob, deleteJob
├── routes/
│   ├── authRoutes.js         # /api/auth/*
│   └── jobRoutes.js          # /api/jobs/* (all protected)
├── middleware/
│   ├── authMiddleware.js     # JWT verification → sets req.user
│   └── errorMiddleware.js    # 404 handler + global error handler
├── server.js                 # Entry point
├── package.json
└── .env.example
```

---

## Environment Variables

| Variable         | Description                        | Default         |
|------------------|------------------------------------|-----------------|
| `PORT`           | Port the server listens on         | `5000`          |
| `NODE_ENV`       | `development` or `production`      | `development`   |
| `MONGO_URI`      | MongoDB connection string          | —               |
| `JWT_SECRET`     | Secret key for signing JWTs        | —               |
| `JWT_EXPIRES_IN` | Token expiry duration              | `7d`            |
| `CLIENT_URL`     | Frontend URL for CORS              | `http://localhost:3000` |

---

## API Reference

### Health Check

| Method | Endpoint       | Auth | Description       |
|--------|----------------|------|-------------------|
| GET    | `/api/health`  | No   | Server status     |

---

### Auth Routes — `/api/auth`

#### POST `/api/auth/register`
Create a new account.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "secret123"
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGci...",
  "user": { "_id": "...", "name": "Jane Smith", "email": "jane@example.com" }
}
```

---

#### POST `/api/auth/login`
Login and receive a JWT.

**Request Body:**
```json
{ "email": "jane@example.com", "password": "secret123" }
```

**Response (200):** Same shape as register.

---

#### GET `/api/auth/me`
Get the current user's profile. Requires token.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{ "success": true, "user": { "_id": "...", "name": "...", "email": "..." } }
```

---

### Job Routes — `/api/jobs`

> All job routes require `Authorization: Bearer <token>` header.

#### GET `/api/jobs`
Get all jobs for the logged-in user.

**Optional query params:**
- `?status=Interview` — filter by status
- `?search=google` — search company or role

**Response (200):**
```json
{ "success": true, "count": 3, "jobs": [ ... ] }
```

---

#### POST `/api/jobs`
Create a new job application.

**Request Body:**
```json
{
  "company": "Google",
  "role": "Software Engineer Intern",
  "status": "Applied",
  "appliedDate": "2024-03-15",
  "notes": "Applied via referral from John."
}
```
> `status` must be one of: `Applied`, `Interview`, `Offer`, `Rejected`

---

#### GET `/api/jobs/:id`
Get a single job by ID.

---

#### PUT `/api/jobs/:id`
Update a job. Send only the fields you want to change.

**Request Body:**
```json
{ "status": "Interview", "notes": "Phone screen scheduled for Monday." }
```

---

#### DELETE `/api/jobs/:id`
Delete a job.

**Response (200):**
```json
{ "success": true, "message": "Job deleted successfully.", "deletedJob": { ... } }
```

---

## Error Response Format

All errors follow a consistent shape:
```json
{
  "success": false,
  "message": "Human-readable error description"
}
```

| Status | Meaning                                |
|--------|----------------------------------------|
| 400    | Bad request / validation error         |
| 401    | Unauthorized (missing or invalid JWT)  |
| 404    | Resource not found                     |
| 409    | Conflict (e.g. duplicate email)        |
| 500    | Internal server error                  |