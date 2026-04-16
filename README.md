# gyan.it — Production React Frontend

India's free NPTEL-style learning platform. React + Vite + Supabase.

## Quick Start

```bash
npm install
cp .env.example .env.local   # fill in Supabase credentials
npm run dev
```

## Connecting Supabase

1. Create a project at https://app.supabase.com
2. Run `supabase_schema.sql` in the SQL Editor
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`
4. In `src/lib/api.js` set `USE_MOCK = false`

## Deployment (Vercel)

```bash
npm i -g vercel && vercel --prod
```

Add a `vercel.json`:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

## Structure

```
src/
  components/   Button, CourseCard, Navbar, Footer, Spinner, SEOHead,
                ErrorBoundary, ProtectedRoute
  context/      AuthContext (Supabase auth + profile)
  data/         mockData.js (replaced by Supabase when USE_MOCK=false)
  hooks/        useAsync, useDebounce, useLocalStorage
  lib/          supabase.js, api.js (all DB calls in one place)
  pages/        Landing, Courses, CourseDetail, Quiz, Login, NotFound
```

## Auth Flow

- Signup → Supabase Auth → inserts USER + STUDENT/INSTRUCTOR rows
- Login → session auto-persisted in localStorage
- ProtectedRoute wraps /quiz → redirects to /login, returns after auth
