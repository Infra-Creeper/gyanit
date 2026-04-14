# Login & Authentication Setup Guide

## Overview
The application uses Supabase for authentication and user management. The login feature is now fully integrated with backend support.

## Supabase Database Schema

You need to create the following table in your Supabase project:

### Users Table
```sql
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  username text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('Student', 'Instructor')),
  avatar_url text,
  bio text,
  created_at timestamp with time zone DEFAULT NOW(),
  updated_at timestamp with time zone DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can read their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Allow any authenticated user to read other users (for instructors list, etc.)
CREATE POLICY "Authenticated users can read all profiles"
  ON users FOR SELECT
  USING (auth.role() = 'authenticated');
```

## Creating the Users Table via Supabase Dashboard

1. Go to your Supabase project
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the SQL above
5. Click **Run**

Alternatively, use the Table Editor:
1. Go to **Table Editor**
2. Click **Create a new table**
3. Name it `users`
4. Add the following columns:
   - `id` (UUID, Primary Key, Foreign Key to auth.users)
   - `name` (Text, Required)
   - `email` (Text, Required)
   - `username` (Text, Required, Unique)
   - `role` (Text, Default 'Student')
   - `avatar_url` (Text)
   - `bio` (Text)
   - `created_at` (TimestampTZ, Default NOW())
   - `updated_at` (TimestampTZ, Default NOW())

## Frontend Features

### Login
- Email/password authentication via Supabase
- Validates email and password format
- Shows loading state during authentication
- Displays error messages if login fails
- Redirects to courses page on success

### Sign Up
- Create new account with name, email, username, and password
- Select role (Student or Instructor)
- Password minimum 8 characters
- Creates user profile in database
- Automatic login after successful signup

### Logout
- Available in the Navbar when logged in
- Clears user session and redirects to home

## API Integration

### Using the API Utility
The `src/utils/api.js` file provides authenticated API calls:

```javascript
import { fetchAPI, getCourses } from '@/utils/api';

// GET request
const courses = await getCourses();

// POST request
const result = await fetchAPI('/quizzes/123/submit', {
  method: 'POST',
  body: JSON.stringify(answerData),
});
```

All requests automatically include:
- `Authorization: Bearer {token}` header
- `Content-Type: application/json`

### Backend Requirements

If you have a custom backend, it should:
1. Accept Supabase JWT tokens in the `Authorization` header
2. Verify tokens using Supabase's public key
3. Return user info from the token

Example backend validation (Node.js):
```javascript
const jwt = require('jsonwebtoken');
const supabaseKey = process.env.SUPABASE_JWT_SECRET;

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const decoded = jwt.verify(token, supabaseKey);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
```

## Environment Variables

The following environment variables are already configured in `.env`:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase public key

If you have a custom backend API, add:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

## Testing Login

1. **Create a test account:**
   - Go to http://localhost:5173/login?tab=signup
   - Fill in credentials and sign up

2. **Login:**
   - Go to http://localhost:5173/login
   - Enter your credentials
   - Should redirect to /courses

3. **Verify authentication:**
   - Check Navbar shows your name
   - Logout button is visible
   - Token persists on page refresh

## Troubleshooting

### "Invalid login credentials"
- Verify email and password are correct
- Check user exists in Supabase auth
- Check users table has the profile

### "User already exists"
- Email is already registered
- Try with a different email

### User not persisting after refresh
- Check browser allows cookies
- Verify Supabase session is stored
- Check browser console for errors

## Next Steps

1. Set up Supabase database schema (see SQL above)
2. Test login/signup flow
3. Integrate additional API endpoints using `fetchAPI()`
4. Add profile page for users to edit their info
5. Implement password reset functionality
