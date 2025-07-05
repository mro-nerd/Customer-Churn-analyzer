#!/bin/bash

echo "Installing authentication dependencies for the backend..."

# Navigate to backend directory
cd Backend

# Install new dependencies
pip install flask-jwt-extended>=4.6.0
pip install flask-bcrypt>=1.0.1
pip install flask-sqlalchemy>=3.1.1

echo "Dependencies installed successfully!"
echo "You can now run the backend server with the new authentication system."