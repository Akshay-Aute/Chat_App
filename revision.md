# Chat App Revision Notes (Current Project State)

Date: 2026-04-14

This revision file reflects the latest implementation status after current project progress.

## 1. Project Snapshot

- Monorepo with two apps:
- backend/ -> Express + MongoDB + JWT cookie auth
- frontend/ -> React + Vite + React Router + Zustand

Current high-level status:

- Backend auth is working (signup, login, logout, check auth).
- Route protection middleware is implemented and used.
- Message APIs (sidebar users, fetch messages, send message) are implemented.
- Frontend routing/auth guard shell is implemented.
- Frontend UI pages are mostly placeholders right now.

## 2. Backend Revision (Implemented)

### 2.1 Dependencies in use

From backend/package.json:

- express
- mongoose
- dotenv
- bcryptjs
- jsonwebtoken
- cookie-parser
- cors
- cloudinary
- socket.io (installed, real-time layer still pending)

### 2.2 Server bootstrap flow

File: backend/src/index.js

Flow:

1. Loads dotenv config.
2. Creates express app.
3. Uses middleware: express.json, cookieParser, cors, express.urlencoded.
4. CORS configured for frontend origin http://localhost:5173 with credentials true.
5. Mounts routes:

- /api/auth
- /api/message

6. Starts server on process.env.PORT and then connects MongoDB.

### 2.3 Auth routes and controllers

File: backend/src/routes/auth.route.js

Endpoints:

- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/logout
- PUT /api/auth/update-profile (protected)
- GET /api/auth/check (protected)

Controller status (backend/src/controllers/auth.controller.js):

- signup: complete (validation, duplicate check, hashing, save, JWT cookie, response).
- login: complete (find user, password compare, JWT cookie, response).
- logout: complete (clears jwt cookie with maxAge 0).
- updateProfile: uploads base64/image data to Cloudinary and updates profilePic.
- checkAuth: returns req.user from middleware.

### 2.4 Auth middleware

File: backend/src/middleware/auth.middleware.js

protectRoute does:

1. Reads jwt cookie.
2. Verifies JWT.
3. Finds user and excludes password.
4. Attaches user to req.user.
5. Handles invalid/expired token responses.

### 2.5 Messaging module

Route file: backend/src/routes/message.route.js

Endpoints:

- GET /api/message/users (protected)
- GET /api/message/:id (protected)
- POST /api/message/send/:id (protected)

Controller file: backend/src/controllers/message.controller.js

Implemented behavior:

- getUsersForSidebar: returns all users except logged-in user.
- getMessages: fetches chat history between two users sorted by createdAt ascending.
- sendMessage: supports text and optional image, validates non-empty payload, uploads image to Cloudinary if provided, saves message.

Message model (backend/src/models/message.model.js):

- senderId (ObjectId ref User)
- receiverId (ObjectId ref User)
- text (trimmed string)
- image (string URL)
- timestamps enabled

### 2.6 JWT + cookie utility

File: backend/src/lib/utils.js

generateToken(userId, res):

- signs token with JWT_SECRET
- expires in 7 days
- sets httpOnly jwt cookie
- sameSite strict
- secure true outside development

## 3. Frontend Revision (Implemented)

### 3.1 Dependencies in use

From frontend/package.json:

- react, react-dom
- react-router-dom
- axios
- zustand
- react-hot-toast
- lucide-react
- tailwindcss + daisyui

### 3.2 App routing and auth guard shell

File: frontend/src/App.jsx

Current flow:

1. On mount, checkAuth is called from Zustand store.
2. While auth check is running and no user is present, loader is shown.
3. Route guards:

- / shows HomePage only when authenticated
- /signup and /login redirect to / when already authenticated
- /profile requires auth
- /setting is public in current setup

### 3.3 API client and store

Files:

- frontend/src/lib/axios.js
- frontend/src/store/useAuthStore.js

Current status:

- Axios instance points to http://localhost:3000/api with credentials enabled.
- Zustand store contains:
- authUser
- isSigningUp
- isLoggingIn
- isUpdatingProfile
- isCheckingAuth
- checkAuth function implemented using GET /auth/check.

### 3.4 UI pages/components status

Files checked:

- frontend/src/components/Navbar.jsx
- frontend/src/pages/HomePage.jsx
- frontend/src/pages/LoginPage.jsx
- frontend/src/pages/SignupPage.jsx
- frontend/src/pages/ProfilePage.jsx
- frontend/src/pages/SettingPage.jsx

Current state:

- Components/pages exist.
- Most pages are placeholder UI text.
- Auth forms and full chat UI are not implemented yet.

## 4. End-to-End Flow You Can Explain in Viva

### 4.1 Signup/Login/Auth check flow

1. Frontend sends credentials to /api/auth/signup or /api/auth/login.
2. Backend validates and authenticates user.
3. Backend sets jwt cookie (httpOnly).
4. Frontend calls /api/auth/check on refresh/load.
5. protectRoute validates cookie and returns current user.
6. Frontend stores user in Zustand and applies route guards.

### 4.2 Messaging flow

1. Authenticated user requests /api/message/users for sidebar list.
2. Selects a user and fetches /api/message/:id for chat history.
3. Sends message via /api/message/send/:id with text and/or image.
4. Backend persists message in MongoDB.
5. Real-time push is pending (Socket.IO TODO remains).

## 5. Environment Variables Required

Backend .env should include:

- PORT
- MONGO_URI
- JWT_SECRET
- NODE_ENV
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET

## 6. Current Gaps / Next Work Items

Top pending implementation:

1. Complete frontend auth actions (signup/login/logout/update profile) in Zustand.
2. Build real form UI for login/signup/profile pages.
3. Build actual chat interface (sidebar, message list, input box, image preview).
4. Integrate message APIs into frontend state.
5. Add Socket.IO server-client integration for real-time messaging.

Known code issue to fix soon:

- In updateProfile controller, User.findByIdAndUpdate is missing await, so response may return a pending promise instead of updated user data.

Lint/tooling note:

- frontend/src/index.css has Unknown at rule @plugin in current problems list (editor/lint configuration mismatch with Tailwind v4 style directives).

## 7. Quick 1-Minute Revision Summary

- Backend core for auth and basic messaging API is now implemented.
- JWT cookie-based protection and checkAuth flow are working.
- Cloudinary integration exists for profile/message images.
- Frontend routing and auth-check structure is ready, but UI and store actions are still mostly pending.
- Real-time chat via Socket.IO is the major next milestone.

---

Use this file as your current revision baseline before each new coding session.
