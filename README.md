# Travel Vault - Authentication System

This project implements a flexible authentication system using Clerk for React Native Expo. The authentication system is designed to be easily swappable with other providers in the future.

## Features
- Email/password authentication
- Google Sign-In
- Forgot password flow
- Protected routes
- State management with Zustand
- Theming with customizable brand colors

## Project Structure

```
app/
├── (auth)/                  # Authentication screens
│   ├── _layout.tsx          # Layout for auth screens
│   ├── sign-in.tsx          # Sign in screen
│   ├── sign-up.tsx          # Sign up screen (collects first and last name)
│   └── forgot-password.tsx  # Forgot password screen
├── (protected)/             # Protected routes
│   ├── _layout.tsx          # Layout with auth protection
│   └── home.tsx             # Protected home screen
├── _layout.tsx              # Root layout with AuthProvider
└── index.tsx                # Entry point with auth redirection
constants/
├── Colors.ts                # Theme colors
├── BrandColors.ts           # Brand color (purple) - easily changeable
lib/
├── auth/                    # Auth implementation
│   ├── AuthProvider.tsx     # Generic auth provider (currently uses Clerk)
│   ├── AuthContext.tsx      # Auth context definition
│   ├── withAuth.tsx         # HOC for protected components
│   └── useAuth.ts           # Custom hook for auth
store/
└── authStore.ts             # Zustand store for auth state
```

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with your Clerk publishable key:
   ```
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   ```
4. Start the development server:
   ```
   npm start
   ```

## Authentication Flow

1. When the app starts, it checks if the user is authenticated
2. If authenticated, redirects to the protected home screen
3. If not authenticated, redirects to the sign-in screen
4. Users can sign in with email/password or Google
5. New users can create an account on the sign-up screen
6. Users can reset their password on the forgot password screen

## Customization

### Changing the Brand Color

To change the brand color, simply update the `primary` color in `constants/BrandColors.ts`:

```typescript
export const BrandColors = {
  primary: '#your_color_here', // Change this to your desired color
};
```

### Switching Auth Providers

The authentication system is designed to be easily swappable. To switch to a different auth provider:

1. Create a new implementation in `lib/auth/AuthProvider.tsx`
2. Update the provider while keeping the same interface

## State Management

The app uses Zustand for state management. The auth store is defined in `store/authStore.ts` and provides:

- Authentication status
- User information
- Loading state
- Methods for updating the state

## Protected Routes

Routes in the `(protected)` directory are only accessible to authenticated users. The protection is implemented in the `_layout.tsx` file, which redirects unauthenticated users to the sign-in screen.
