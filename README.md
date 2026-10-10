# Hookshot — Webhook Event Platform

This project contains the existing Express/MongoDB API and a complete React + Vite frontend connected to it.

## Requirements
- Node.js 20.19+ or 22.12+
- MongoDB running locally, or a MongoDB URI you control

## 1. Start the backend
From the project root (`UC_task3_work` after extraction):

```bash
npm install
```

Copy `.env.example` to `.env` and set a long random `JWT_SECRET`. The default MongoDB URI is `mongodb://127.0.0.1:27017/hookshot`.

```bash
npm run dev
```

The API starts at `http://localhost:3000`. Check `http://localhost:3000/health`.

## 2. Start the frontend
Open a second terminal:

```bash
cd FrontEnd
npm install
```

Copy `FrontEnd/.env.example` to `FrontEnd/.env` if you need to change the API address. Then run:

```bash
npm run dev
```

Open `http://localhost:5173`.

## Implemented frontend features
- Sign up, sign in, token persistence, authenticated routes, profile check, sign out
- Dashboard overview with live endpoint/event counts and backend cache metrics
- Create, list, edit, activate/pause, search, filter and delete webhook endpoints
- Publish JSON events with a required idempotency key
- Event history, payload inspection, delivery status/error/response inspection
- Loading, empty, success and error states; responsive desktop/mobile layout

## API integration
| Method | Path | Purpose |
|---|---|---|
| POST | `/api/auth/signup` | Create account (returns token + user) |
| POST | `/api/auth/login` | Sign in (returns token) |
| GET | `/api/auth/me` | Validate token and fetch current user |
| GET | `/api/endpoints` | List the signed-in user's endpoints |
| POST | `/api/endpoints` | Create an endpoint `{ "url": "https://..." }` |
| PATCH | `/api/endpoints/:id` | Update endpoint URL and/or `{ "active": true/false }` |
| DELETE | `/api/endpoints/:id` | Delete an endpoint |
| GET | `/api/events` | List latest events |
| POST | `/api/events` | Publish `{ "type": "...", "data": {} }`; requires `Idempotency-Key` header |
| GET | `/api/events/:id` | Fetch event details and its delivery records |
| GET | `/debug/cache` | Read cache stats used by the dashboard |

All protected calls automatically include `Authorization: Bearer <token>`.

## Notes
- Webhook delivery requires publicly reachable endpoint URLs; localhost/private targets are intentionally rejected by the backend delivery service.
- The frontend's event details page uses `GET /api/events/:id`, added to the backend to expose delivery records for saved events.
- Set the same `JWT_SECRET` in the backend environment before using real accounts. Changing it invalidates existing tokens.
- This app expects the API to run on port 3000 by default. Override it with `VITE_API_BASE_URL` in `FrontEnd/.env`.
