# Clerk Authentication Setup

This project now uses **Clerk** for authentication instead of Kinde.

## Getting Your Clerk Keys

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application or select your existing one
3. Go to **API Keys** in the sidebar
4. Copy your **Publishable Key**

## Environment Setup

Update your `frontend/.env` file with your Clerk publishable key:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

## Features

- ✅ Sign in / Sign up modals
- ✅ User profile management
- ✅ Protected routes
- ✅ User button with dropdown
- ✅ Dark mode support

## How It Works

- **ClerkProvider** wraps the entire app in `src/main.jsx`
- **SignInButton** and **SignUpButton** components trigger authentication modals
- **UserButton** component shows user profile and sign-out option
- **useUser()** hook provides authentication state and user info
- Protected routes redirect to home if user is not signed in

## Testing Locally

1. Add your Clerk publishable key to `.env`
2. Run `npm run dev`
3. Click "Sign In" or "Get Started"
4. Sign up with email or social providers
5. You'll be redirected to the dashboard after authentication

## Deployment

Make sure to add `VITE_CLERK_PUBLISHABLE_KEY` to your deployment environment variables (Vercel, Netlify, etc.).
