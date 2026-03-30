# Blog API Backend

## Description
This is a robust backend REST API for a complete blog application. It manages user authentication, blog posts, and commenting functionalities.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs for password hashing
- **Security & Utils**: Helmet, CORS, Morgan (HTTP request logging), Slugify

## Project Structure
```text
src/
├── app.ts                 # Express application initialization and middleware setup
├── server.ts              # Server entry point
├── config/                # Configuration files (e.g., database connection)
├── controllers/           # Route handler logic (Auth, Post, Comment)
├── middleware/            # Custom express middlewares (e.g., JWT authentication)
├── models/                # Mongoose database schemas (User, Post, Comment)
├── routes/                # Express routers defining API endpoints
├── services/              # Business logic, decoupling controllers from database calls
├── types/                 # Custom TypeScript interfaces and types
├── utils/                 # Application utilities and helpers
└── validators/            # Validation schemas for request inputs
```

## API Routes

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user and receive a JWT token

### Posts (`/api/posts`)
- `POST /api/posts` - Create a new post (Auth required)
- `GET /api/posts` - Get all posts (Supports pagination: `?page=x&limit=y`, filters: `?tag=x`, `?author=x`, `?search=x`)
- `GET /api/posts/me` - Get all posts of the currently authenticated user (Auth required)
- `GET /api/posts/:slug` - Get a specific post by its slug (Public)
- `PATCH /api/posts/:id` - Update an existing post (Auth required)
- `DELETE /api/posts/:id` - Delete a post (Auth required)
- `PATCH /api/posts/:id/like` - Toggle like on a post (Auth required)

### Comments (`/api/comments`)
- `POST /api/comments/:postId` - Add a comment to a specified post (Auth required)
- `GET /api/comments/:postId` - Get comments for a specified post (Supports pagination: `?page=x&limit=y`)
- `DELETE /api/comments/:id` - Delete a single comment by ID (Auth required)

---

## Tips for Code Improvement

After thoroughly reviewing your code, here are practical ways you can elevate it to production-grade quality:

1. **Implement Centralized Error Handling**
   - *Current State*: Every controller method is wrapped in `try...catch` blocks that handle response errors redundantly.
   - *Improvement*: Use an asynchronous wrapper function (e.g., `express-async-handler`) and offload error responses to a global, centralized Express error-handling middleware. This drastically cleans up your controller code.

2. **Validation Layer on Routes**
   - *Current State*: Validation is primarily relying on Mongoose models blowing up, which sends DB errors directly to controllers.
   - *Improvement*: Use a strict validation library like `Zod`, `Joi`, or `express-validator` to intercept and validate request bodies (`req.body`), queries, and parameters *before* it even reaches your controllers.

3. **Standardize Pagination Logic**
   - *Current State*: Pagination defaults (`page = Number(req.query.page) || 1; limit = ...`) are duplicated across `post.controller.ts` and `comment.controller.ts`.
   - *Improvement*: Abstract extracting pagination logic into a separate reusable utility function or a middleware piece.

4. **Environment Variables Safety**
   - *Current State*: Code assumes process variables (like `process.env.JWT_SECRET`) are always present.
   - *Improvement*: Implement schema validation on startup (e.g., Zod) ensuring the app outright crashes if required config environments are missing.

5. **Security Enhancements**
   - *Improvement*: Add an API Rate Limiting middleware (e.g. `express-rate-limit`) on sensitive routes like `/api/auth/login` to prevent brute-force attacks.

6. **Production Logging**
   - *Current State*: The app uses `morgan` and standard `console.log()` / `console.error()`.
   - *Improvement*: Introduce a standardized logging library like `Winston` or `Pino`. This manages log levels (info, debug, error) cleanly and supports structured logging in JSON (helpful for log monitoring systems).
