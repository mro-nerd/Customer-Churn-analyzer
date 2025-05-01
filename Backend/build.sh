#!/bin/bash
# exit on error
set -e

# Print current directory for debugging
echo "Current directory: $(pwd)"

# Install dependencies
pip install -r requirements.txt

# Ensure model folders exist
mkdir -p uploads models

# Make sure the model directory has correct permissions
chmod -R 755 models
chmod -R 755 uploads

echo "Build script completed successfully!"