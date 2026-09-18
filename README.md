# Sehatia Web Demo

Interactive phone-framed preview of the Sehatia / HopeFront mobile app.
**No API calls** — all flows run on client-side mock state (Zustand + localStorage).

## Run locally

```bash
cd web
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## Deploy on Vercel

1. Import this GitHub repo into Vercel
2. Set **Root Directory** to `web`
3. Build command: `npm run build`
4. Output directory: `dist`

`vercel.json` already rewrites all routes to `index.html` for SPA routing.

## Demo tips

- **Language:** tap **عربي** / **EN** on splash, login, dashboards, or Settings → Arabic language
- **Quick start:** tap **Demo Patient** or **Demo Nurse** on the login screen
- **Login:** any valid email + any password → choose Nurse or Patient
- **Patient PIN:** `1234`
- **Forgot password OTP:** `1234`
- Seeded nurses, bookings, chats, and wallet balance are ready after login
- Arabic mode flips the layout to **RTL** and persists in localStorage

## Stack

Vite · React 19 · TypeScript · Tailwind CSS v4 · React Router · Zustand · Framer Motion · Lucide
