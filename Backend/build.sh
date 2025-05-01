#!/bin/bash
# exit on error
set -e

# Print current directory for debugging
echo "Current directory: $(pwd)"

# Install dependencies
pip install -r requirements.txt


mkdir -p uploads models


chmod -R 755 models
chmod -R 755 uploads

echo "Build script completed successfully!"