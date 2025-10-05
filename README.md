# AWSLearning

# Authentication Architecture

## Overview
This project uses a dual-layer authentication system with both backend middleware and frontend token management for secure and seamless user experience.

## Components

### 🔐 Backend Middleware (`authenticateToken`)
- **Location**: `server.js` - applied to `/api/user-auth` routes
- **Purpose**: Server-side protection and validation
- **Function**: 
  - Validates JWT tokens on every incoming request
  - Prevents unauthorized API access
  - Adds user information to request object (`req.user`)
- **Security**: Server-side token verification ensures API endpoint protection

### 🔄 Frontend Utility (`makeAuthenticatedRequest`)
- **Location**: `frontend/src/utils/api.js`
- **Purpose**: Client-side token management and user experience
- **Function**:
  - Automatically handles token refresh when access tokens expire
  - Retries failed requests with fresh tokens
  - Handles cleanup and redirects when refresh fails
- **UX Benefit**: Users stay logged in seamlessly without manual re-authentication

## Authentication Flow

1. **Request Initiation**: Frontend makes API call using `makeAuthenticatedRequest`
2. **Token Validation**: Backend middleware validates the JWT token
3. **Token Expiry Handling**: If token expired (401/403), frontend utility:
   - Uses refresh token to obtain new access token
   - Retries original request with fresh token
4. **Success**: Backend validates new token and grants access
5. **Failure**: If refresh fails, user is redirected to login

## Why Both Are Needed

| Component | Without It | With It |
|-----------|------------|---------|
| **Backend Middleware** | API endpoints unprotected | Secure server-side validation |
| **Frontend Utility** | Users manually re-login on token expiry | Seamless token refresh experience |

## Key Benefits

- ✅ **Security**: Server-side token validation prevents unauthorized access
- ✅ **User Experience**: Automatic token refresh keeps users logged in
- ✅ **Efficiency**: Reduces unnecessary login interruptions
- ✅ **Separation of Concerns**: Backend handles security, frontend handles UX

## Routes Structure

- **Unauthenticated**: `/api/user-unAuth/*` (login, register, refresh)
- **Authenticated**: `/api/user-auth/*` (protected routes with middleware)