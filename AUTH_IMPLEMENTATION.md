# Authentication Implementation Guide

## Overview
This project now includes a complete user authentication system with JWT tokens, user registration, login, and protected routes.

## Backend Changes

### New Dependencies
- `flask-jwt-extended>=4.6.0` - JWT token management
- `flask-bcrypt>=1.0.1` - Password hashing
- `flask-sqlalchemy>=3.1.1` - Database ORM

### Installation
Run the installation script to install new dependencies:
```bash
./install_auth_dependencies.sh
```

Or manually install:
```bash
cd Backend
pip install flask-jwt-extended>=4.6.0 flask-bcrypt>=1.0.1 flask-sqlalchemy>=3.1.1
```

### New Features Added

#### User Model
- SQLite database with user table
- Password hashing with bcrypt
- User fields: id, username, email, password_hash, created_at

#### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile (protected)
- `GET /auth/verify-token` - Verify JWT token (protected)

#### Protected Routes
All prediction and model management routes now require authentication:
- `POST /predict` - Single prediction
- `POST /batch-predict` - Batch prediction
- `POST /retrain-model` - Model retraining
- `POST /set-active-model` - Set active model
- `GET /get-active-model` - Get active model

## Frontend Changes

### New Components
- `AuthContext.jsx` - Global authentication state management
- `Login.jsx` - User login form
- `Signup.jsx` - User registration form
- `ProtectedRoute.jsx` - Route protection component

### Updated Components
- `Header.jsx` - Shows authentication status and logout button
- `App.jsx` - Includes authentication routes and protected routes

### Authentication Flow
1. User visits the app
2. If not authenticated, redirected to login page
3. User can login with existing account or create new account
4. Upon successful authentication, JWT token is stored in localStorage
5. All API requests include the JWT token in Authorization header
6. Protected routes are accessible once authenticated

## Usage Instructions

### Starting the Application

1. **Backend:**
   ```bash
   cd Backend
   python app.py
   ```

2. **Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

### User Registration
1. Navigate to `/signup`
2. Fill in username, email, and password
3. Password must be at least 6 characters
4. Upon successful registration, user is automatically logged in

### User Login
1. Navigate to `/login`
2. Enter username and password
3. Upon successful login, user is redirected to home page

### Using the Application
- All prediction and model management features require authentication
- User information is shown in the header
- Logout button is available in the header
- JWT tokens expire after 24 hours

## Security Features
- Passwords are hashed using bcrypt
- JWT tokens with configurable expiration
- Protected routes require valid JWT tokens
- Token verification on app initialization
- Automatic token cleanup on logout

## Database
The application uses SQLite for user storage. The database file (`users.db`) is automatically created when the application starts.

## Configuration
Update the JWT secret key in `Backend/app.py` for production:
```python
app.config['JWT_SECRET_KEY'] = 'your-secret-key-change-this-in-production'
```

## Error Handling
- Invalid credentials return appropriate error messages
- Expired tokens are handled gracefully
- Network errors are caught and displayed to users
- Form validation prevents common input errors