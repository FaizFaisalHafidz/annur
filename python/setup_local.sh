#!/bin/bash

# Setup Python Virtual Environment untuk Development Lokal
# Script ini akan membuat virtual environment dan install dependencies

set -e  # Exit on any error

echo "🐍 Setting up Python Virtual Environment..."
echo "============================================"

# Variabel
PYTHON_DIR="/Users/flashcode/Desktop/sistem-annur/python"
VENV_PATH="$PYTHON_DIR/.venv"

# Fungsi untuk log
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Fungsi untuk error handling
error_exit() {
    echo "❌ Error: $1" >&2
    exit 1
}

# 1. Masuk ke direktori python
cd "$PYTHON_DIR" || error_exit "Gagal masuk ke direktori python"

# 2. Hapus virtual environment lama jika ada
if [ -d ".venv" ]; then
    log "🗑️ Menghapus virtual environment lama..."
    rm -rf .venv
fi

# 3. Buat virtual environment baru
log "📦 Membuat virtual environment baru..."
python3 -m venv .venv || error_exit "Gagal membuat virtual environment"

# 4. Aktifkan virtual environment
log "🔄 Mengaktifkan virtual environment..."
source .venv/bin/activate || error_exit "Gagal mengaktifkan virtual environment"

# 5. Upgrade pip
log "⬆️ Upgrading pip..."
pip install --upgrade pip setuptools wheel

# 6. Install dependencies dari requirements.txt
if [ -f "requirements.txt" ]; then
    log "📚 Installing dependencies dari requirements.txt..."
    pip install -r requirements.txt
else
    log "📚 Installing dependencies manual..."
    pip install pandas==2.1.4
    pip install numpy==1.24.4
    pip install scikit-learn==1.3.2
    pip install joblib==1.3.2
    pip install mysql-connector-python==8.2.0
    pip install python-dotenv==1.0.0
fi

# 7. Test installation
log "🧪 Testing Python environment..."
python -c "
import pandas as pd
import numpy as np
import sklearn
import joblib
import mysql.connector
from dotenv import load_dotenv
print('✅ Semua dependencies berhasil diinstall')
print(f'Pandas: {pd.__version__}')
print(f'NumPy: {np.__version__}')
print(f'Scikit-learn: {sklearn.__version__}')
print(f'Joblib: {joblib.__version__}')
print(f'MySQL Connector: {mysql.connector.__version__}')
"

# 8. Buat script aktivasi
log "📝 Membuat script aktivasi..."
cat > activate_venv.sh << 'EOF'
#!/bin/bash
# Script untuk mengaktifkan virtual environment
cd "$(dirname "$0")"
source .venv/bin/activate
echo "🐍 Virtual environment activated!"
echo "Python: $(python --version)"
echo "Pip: $(pip --version)"
echo ""
echo "💡 Untuk menjalankan script prediksi:"
echo "   python predict_silent.py '{...json_data...}'"
echo ""
echo "💡 Untuk keluar dari virtual environment:"
echo "   deactivate"
EOF

chmod +x activate_venv.sh

# 9. Test predict script
log "🧪 Testing predict_silent.py..."
python predict_silent.py '{"matematika": 85, "bahasa_indonesia": 80, "bahasa_inggris": 90, "fisika": 88, "kimia": 87, "biologi": 85, "sejarah": 78, "geografi": 79, "ekonomi": 82, "sosiologi": 80, "pkn": 83, "seni_budaya": 75, "prakarya": 77, "pjok": 85, "peminatan_1": 88, "peminatan_2": 86, "rata_rata_keseluruhan": 82, "rencana_kuliah": "Iya", "kategori_jurusan": "Saintek", "tingkat_keyakinan": 85}' > /dev/null

if [ $? -eq 0 ]; then
    echo "✅ predict_silent.py test berhasil!"
else
    echo "⚠️ predict_silent.py test gagal - periksa konfigurasi database"
fi

echo ""
echo "✅ Setup Virtual Environment Selesai!"
echo "==========================================="
echo "📁 Virtual Environment: $VENV_PATH"
echo "🔄 Untuk mengaktifkan: cd python && source .venv/bin/activate"
echo "🔄 Atau gunakan: cd python && ./activate_venv.sh"
echo ""
echo "📝 Installed packages:"
pip list --format=columns
echo ""
echo "🚀 Siap untuk development!"