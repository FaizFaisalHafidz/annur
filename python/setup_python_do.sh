#!/bin/bash

# Setup Python Environment untuk Sistem Prediksi Jurusan KNN
# Digital Ocean Ubuntu Server Setup Script
# Created: September 2025

echo "🚀 Starting Python Environment Setup for Sistem Annur..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if script is run as root
if [[ $EUID -ne 0 ]]; then
   print_error "This script must be run as root (use sudo)"
   exit 1
fi

# Get current directory
CURRENT_DIR=$(pwd)
print_status "Current directory: $CURRENT_DIR"

# Step 1: Update system
print_status "Updating system packages..."
apt update && apt upgrade -y

# Step 2: Install Python 3.11 (more compatible than 3.12)
print_status "Installing Python 3.11 and development tools..."
apt install -y software-properties-common
add-apt-repository ppa:deadsnakes/ppa -y
apt update
apt install -y python3.11 python3.11-venv python3.11-dev python3-pip
apt install -y build-essential gcc g++ make
apt install -y libmysqlclient-dev pkg-config

# Step 3: Install MySQL client development headers
print_status "Installing MySQL development packages..."
apt install -y default-libmysqlclient-dev mysql-client

# Step 4: Create Python virtual environment with Python 3.11
print_status "Creating Python 3.11 virtual environment..."
if [ -d ".venv" ]; then
    print_warning "Removing existing .venv directory..."
    rm -rf .venv
fi

python3.11 -m venv .venv

# Step 5: Activate virtual environment and upgrade pip
print_status "Activating virtual environment and upgrading pip..."
source .venv/bin/activate
pip install --upgrade pip setuptools wheel

# Step 6: Create updated requirements.txt with compatible versions
print_status "Creating compatible requirements.txt..."
cat > requirements_fixed.txt << EOF
# Compatible versions for Python 3.11
pandas==2.1.4
numpy==1.24.4
scikit-learn==1.3.2
joblib==1.3.2
mysql-connector-python==8.2.0
python-dotenv==1.0.0
setuptools>=65.0.0
wheel>=0.37.0
EOF

# Step 7: Install Python packages
print_status "Installing Python packages..."
pip install -r requirements_fixed.txt

# Step 8: Test installations
print_status "Testing Python installations..."
python -c "
import sys
print(f'Python version: {sys.version}')

try:
    import pandas as pd
    print(f'✅ Pandas {pd.__version__} - OK')
except ImportError as e:
    print(f'❌ Pandas - FAILED: {e}')

try:
    import numpy as np
    print(f'✅ NumPy {np.__version__} - OK')
except ImportError as e:
    print(f'❌ NumPy - FAILED: {e}')

try:
    import sklearn
    print(f'✅ Scikit-learn {sklearn.__version__} - OK')
except ImportError as e:
    print(f'❌ Scikit-learn - FAILED: {e}')

try:
    import joblib
    print(f'✅ Joblib {joblib.__version__} - OK')
except ImportError as e:
    print(f'❌ Joblib - FAILED: {e}')

try:
    import mysql.connector
    print(f'✅ MySQL Connector - OK')
except ImportError as e:
    print(f'❌ MySQL Connector - FAILED: {e}')
"

# Step 9: Update database configuration in Python scripts
print_status "Updating database configuration in Python scripts..."

# Create database config update script
cat > update_db_config.py << 'EOF'
import os
import re

def update_db_config(file_path):
    if not os.path.exists(file_path):
        print(f"File {file_path} not found")
        return
        
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Update database configuration
    old_config = r"config = \{[^}]*\}"
    new_config = """config = {
    'user': 'sistem_annur',
    'password': 'flashcode123',
    'host': 'localhost',
    'database': 'sistem_annur',
    'port': 3306,
    'charset': 'utf8mb4',
    'use_unicode': True,
    'autocommit': True
}"""
    
    content = re.sub(old_config, new_config, content, flags=re.DOTALL)
    
    with open(file_path, 'w') as f:
        f.write(content)
    
    print(f"Updated {file_path}")

# Update all Python files with database connections
files_to_update = [
    'predict_db.py',
    'predict_silent.py'
]

for file_name in files_to_update:
    update_db_config(file_name)
EOF

python update_db_config.py

# Step 10: Set file permissions
print_status "Setting file permissions..."
chmod +x *.py
chmod 755 data/
if [ -d "data" ]; then
    chmod 644 data/*
fi

# Step 11: Test database connection
print_status "Testing database connection..."
python -c "
import mysql.connector
try:
    config = {
        'user': 'sistem_annur',
        'password': 'flashcode123',
        'host': 'localhost',
        'database': 'sistem_annur',
        'port': 3306
    }
    conn = mysql.connector.connect(**config)
    if conn.is_connected():
        print('✅ Database connection successful')
        db_info = conn.get_server_info()
        print(f'MySQL Server version: {db_info}')
        cursor = conn.cursor()
        cursor.execute('SELECT DATABASE();')
        db_name = cursor.fetchone()
        print(f'Connected to database: {db_name[0]}')
        cursor.close()
        conn.close()
    else:
        print('❌ Database connection failed')
except mysql.connector.Error as e:
    print(f'❌ Database connection error: {e}')
except Exception as e:
    print(f'❌ Unexpected error: {e}')
"

# Step 12: Test prediction script
print_status "Testing prediction script..."
if [ -f "predict_silent.py" ]; then
    echo "Testing with sample data..."
    python predict_silent.py '{"jenis_kelamin": "Laki-laki", "matematika": 85, "bahasa_indonesia": 80, "bahasa_inggris": 82, "fisika": 88, "kimia": 84, "biologi": 78, "sejarah": 75, "geografi": 77, "ekonomi": 79, "sosiologi": 76, "pkn": 78, "seni_budaya": 74, "prakarya": 76, "pjok": 80, "peminatan_1": 87, "peminatan_2": 83, "rata_rata_keseluruhan": 80.5, "rencana_kuliah": "Iya", "jurusan_diminati": "Teknik Informatika", "kategori_jurusan": "Saintek", "kategori_jurusan_encoded": 1, "tingkat_keyakinan": 85, "mata_pelajaran_dikuasai": ["matematika", "fisika", "kimia", "bahasa_inggris"]}'
else
    print_warning "predict_silent.py not found, skipping test"
fi

# Step 13: Create activation script
print_status "Creating activation script..."
cat > activate_python.sh << 'EOF'
#!/bin/bash
# Activation script for Python environment
cd /var/www/annur/python
source .venv/bin/activate
echo "✅ Python environment activated"
echo "Current directory: $(pwd)"
echo "Python version: $(python --version)"
echo "Virtual environment: $VIRTUAL_ENV"
EOF
chmod +x activate_python.sh

# Step 14: Update Laravel controller path (if in Laravel project)
if [ -f "../app/Http/Controllers/PrediksiKNNController.php" ]; then
    print_status "Updating Laravel controller Python path..."
    sed -i 's|base_path(.venv/bin/python)|"/usr/bin/python3.11"|g' ../app/Http/Controllers/PrediksiKNNController.php
    sed -i 's|source.*activate.*&&||g' ../app/Http/Controllers/PrediksiKNNController.php
fi

# Deactivate virtual environment
deactivate

print_status "✨ Python environment setup completed successfully!"
print_status ""
print_status "📋 Setup Summary:"
print_status "  - Python 3.11 installed"
print_status "  - Virtual environment created in .venv/"
print_status "  - All required packages installed"
print_status "  - Database configuration updated"
print_status "  - File permissions set"
print_status ""
print_status "🔧 To use the environment:"
print_status "  cd /var/www/annur/python"
print_status "  source .venv/bin/activate"
print_status "  python predict_silent.py '{\"test\": \"data\"}'"
print_status ""
print_status "🎉 Setup complete! The KNN prediction system is ready to use."

# Cleanup temporary files
rm -f update_db_config.py requirements_fixed.txt

exit 0