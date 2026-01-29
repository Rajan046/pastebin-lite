# Pastebin Lite

A simple pastebin application built with Next.js (React + Node.js).
Allows users to create text pastes with optional expiration (TTL) and view limits.

## deployed URL
(Insert your Vercel URL here after deployment)

## How to Run Locally

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Persistence Layer

This application uses a dual-strategy for persistence to satisfy both the "local run" and "serverless deployment" requirements:

1.  **In-Memory (Local Default):** 
    - Uses a simple Javascript `Map` to store pastes.
    - Useful for quick local testing without setting up external databases.
    - **Note:** Data is lost when the server restarts.

2.  **Vercel KV (Redis) (Production):**
    - Triggered automatically if `KV_REST_API_URL` and `KV_REST_API_TOKEN` environment variables are present.
    - Recommended for deployment on Vercel to ensure data survives serverless function restarts.
    - Uses `@vercel/kv` SDK.

## Important Design Decisions

-   **Next.js App Router:** Selected for its unified architecture (Frontend + API in one project), server-side rendering capabilities (for the `/p/:id` route), and seamless Vercel deployment.
-   **Service Layer Pattern:** Logic for creating, retrieving, and validating pastes (TTL, View Counts) is encapsulated in `src/lib/pasteService.js`. This ensures that both the JSON API (`/api/pastes/:id`) and the HTML View (`/p/:id`) enforce the exact same constraints and side-effects (view counting).
-   **Deterministic Testing:** The application respects `x-test-now-ms` header when `TEST_MODE=1` is set, allowing automated tests to verify expiry logic reliably.
-   **Atomic-ish View Counting:** View counts are decrementing/incremented in the storage layer. For the "Lite" version, we use a Read-Modify-Write approach. In high-concurrency production, atomic Redis `INCR` or Lua scripts would be preferred, but the current implementation meets the functional requirements.
-   **Security:** Paste content is rendered as sanitized text (no innerHTML) to prevent XSS.

## Environment Variables

-   `KV_REST_API_URL`: Vercel KV URL (Production)
-   `KV_REST_API_TOKEN`: Vercel KV Token (Production)
-   `TEST_MODE`: Set to `1` to enable deterministic time testing via headers.
