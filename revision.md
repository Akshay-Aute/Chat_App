# Chat App Revision Notes (Current Project State)

Date: 2026-04-09

This file is a step-by-step revision of what is implemented in your project so far.

## 1. Project Structure Overview

- Monorepo style with two apps:
- `backend/` -> Express + MongoDB + JWT auth API
- `frontend/` -> React + Vite app (starter UI still mostly template)

Important folders:

- `backend/src/controllers` -> request handlers
- `backend/src/routes` -> API routes
- `backend/src/models` -> Mongoose schemas
- `backend/src/lib` -> DB and utility helpers
- `frontend/src` -> React entry and components

## 2. Backend Setup (What is done)

### 2.1 Dependencies installed

From `backend/package.json`:

- `express` for server and routes
- `mongoose` for MongoDB
- `dotenv` for env config
- `bcryptjs` for password hashing
- `jsonwebtoken` for JWT
- `cookie-parser` installed (not used yet in code)
- `cloudinary` and `socket.io` installed (not used yet in code)
- `nodemon` for development

### 2.2 Server entry flow

File: `backend/src/index.js`

Steps:

1. Imports Express and dotenv.
2. Imports DB connector and auth routes.
3. Creates Express app.
4. Loads environment variables using `dotenv.config()`.
5. Uses `express.json()` to parse JSON body.
6. Mounts auth routes at `/api/auth`.
7. Starts server on `process.env.PORT`.
8. After server starts, runs `connectDB()`.

### 2.3 Database connection

File: `backend/src/lib/db.js`

Steps:

1. Calls `mongoose.connect(process.env.MONGO_URI)`.
2. Logs host on success.
3. Logs error on failure.

### 2.4 User model

File: `backend/src/models/user.model.js`

Schema fields:

- `email`: required, unique
- `fullName`: required
- `password`: required, min length 6
- `profilePic`: default empty string
- Timestamps enabled (`createdAt`, `updatedAt`)

### 2.5 Auth routes

File: `backend/src/routes/auth.route.js`

Endpoints:

- `POST /api/auth/signup` -> `signup`
- `POST /api/auth/login` -> `login`
- `POST /api/auth/logout` -> `logout`

### 2.6 JWT utility

File: `backend/src/lib/utils.js`

`generateToken(userId, res)` does:

1. Creates JWT with payload `{ userId }`.
2. Uses `process.env.JWT_SECRET`.
3. Sets token expiry to `7d`.
4. Sends token in cookie named `jwt` with:

- `httpOnly: true`
- `sameSite: "strict"`
- `secure: process.env.NODE_ENV !== "development"`
- `maxAge: 7 days`

### 2.7 Signup controller (implemented)

File: `backend/src/controllers/auth.controller.js`

Current signup flow:

1. Reads `fullName`, `email`, `password` from request body.
2. Validates all fields are present.
3. Validates password length >= 6.
4. Checks if email already exists in DB.
5. Generates salt and hashes password with bcrypt.
6. Creates new user document.
7. Generates JWT cookie.
8. Saves new user.
9. Returns created user data (without password).

Current login/logout status:

- `login` returns placeholder response: `"login route"`
- `logout` returns placeholder response: `"logout route"`

## 3. Frontend Setup (What is done)

### 3.1 Dependencies installed

From `frontend/package.json`:

- `react`, `react-dom`
- `vite`
- ESLint setup with React hooks and refresh plugins

### 3.2 Frontend entry

File: `frontend/src/main.jsx`

Steps:

1. Imports `StrictMode` and `createRoot`.
2. Imports global CSS (`index.css`).
3. Renders `<App />` inside root div.

### 3.3 Current UI state

File: `frontend/src/App.jsx`

What exists now:

- Vite starter layout with hero and docs/social sections.
- Local React state counter (`count`).
- No API integration with backend yet.
- No auth pages/forms yet.

### 3.4 Styling setup

Files:

- `frontend/src/index.css`
- `frontend/src/App.css`

Notes:

- Detailed base styling is present.
- Supports light/dark theme by media query.
- Uses CSS variables and responsive media rules.

## 4. End-to-End Request Flow Revision

For signup endpoint (`POST /api/auth/signup`):

1. Client sends `fullName`, `email`, `password` JSON.
2. Route maps request to `signup` controller.
3. Controller validates payload.
4. Controller checks duplicate email in MongoDB.
5. Password gets hashed.
6. User document prepared and saved.
7. JWT is generated and set in `jwt` cookie.
8. Success response (`201`) returns user public fields.

## 5. Commands to Remember for Revision

From project root:

Backend dev:

- `cd backend`
- `npm install`
- `npm run dev`

Frontend dev:

- `cd frontend`
- `npm install`
- `npm run dev`

## 6. Environment Variables Required

Backend needs these values in `.env`:

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `NODE_ENV` (optional but important for cookie `secure` behavior)

## 7. Important Current Gaps (Very Important for viva/revision)

Not completed yet:

- Login logic (password check + token issuance) is pending.
- Logout logic (clear cookie) is pending.
- Frontend auth UI is pending.
- Frontend-backend API connection is pending.
- Middleware folder exists but is empty.

Code quality caveats to revise:

- In signup validation, response is sent on invalid input but function does not immediately return in those checks.
- In signup catch block, error is logged but failure response is not sent.
- `cookie-parser` is installed but not used in `index.js`.

## 8. Quick Oral Revision (1-minute summary)

- Backend is an Express API using MongoDB and JWT cookie auth.
- User schema is ready and signup is mostly implemented with bcrypt hashing.
- JWT is generated and set as `httpOnly` cookie for 7 days.
- Auth routes are wired (`signup/login/logout`), but login/logout are still placeholders.
- Frontend is currently Vite starter UI and not yet connected to backend.

## 9. Next Implementation Order (Step-by-step)

1. Complete `login` controller (find user, compare password, set JWT cookie).
2. Complete `logout` controller (clear `jwt` cookie).
3. Add proper early returns in signup validations.
4. Add proper error response in catch blocks.
5. Create frontend signup/login forms.
6. Connect forms to `/api/auth/signup` and `/api/auth/login`.
7. Add protected route logic and user state handling.
8. Add profile image upload flow (Cloudinary) later.
9. Add real-time chat with Socket.IO after auth is stable.

---

Use this file before coding sessions to quickly revise architecture, flow, and pending tasks.
