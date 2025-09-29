# EasyTranslate Backend Proxy

This backend exists to proxy requests from the frontend to the EasyTranslate API. It handles authentication, environment variable management, and abstracts away direct API calls from the client, allowing for:
- Centralized credential management
- Simplified API integration for the frontend
- Easier local development and testing

Create environment variables (via .env):
- ET_BASE_URL
- ET_TEAM_NAME
- ET_CLIENT_ID
- ET_CLIENT_SECRET
- ET_USERNAME
- ET_PASSWORD
- PORT (optional, default 3000)

Run options:
- Production/compat: `npm start`
- Dev (modular entry): `npm run dev` (uses `src/index.js`)

Routes:
- GET /user
- GET /folders
- POST /folders
- GET /folders/:folderId/projects
- GET /projects (workspace projects: `filters[is_workspace]=true`)
- POST /projects (JSON:API headers) - should purposefully fail, useful to demo creation error handling and some e2e tests

## CORS
By default, this backend allows requests from the frontend origin (http://localhost:5173) during development.

## Authentication
All API requests to EasyTranslate require valid credentials (see .env setup).
Sensitive credentials should never be committed to source control.