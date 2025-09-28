# Python Virtual Environment Setup

## Struktur Direktori

```
python/
├── .venv/                  # Virtual environment (diignore oleh git)
├── data/                   # Model dan cache data
├── requirements.txt        # Python dependencies
├── setup_local.sh         # Setup untuk development lokal
├── setup_python_do.sh     # Setup untuk Digital Ocean
├── activate_venv.sh       # Script aktivasi (dibuat otomatis)
├── predict.py             # Script prediksi interaktif
├── predict_db.py          # Script prediksi dengan database
├── predict_silent.py      # Script prediksi untuk production
├── train_model.py         # Script training model
└── knn_predictor.py       # Library KNN predictor
```

## Setup Development Lokal

### 1. Otomatis (Recommended)

```bash
cd python
chmod +x setup_local.sh
./setup_local.sh
```

### 2. Manual

```bash
cd python

# Buat virtual environment
python3 -m venv .venv

# Aktifkan virtual environment
source .venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Test installation
python predict_silent.py '{"matematika": 85, ...}'
```

## Penggunaan Virtual Environment

### Aktifasi Virtual Environment

```bash
cd python

# Metode 1: Manual
source .venv/bin/activate

# Metode 2: Script helper
./activate_venv.sh
```

### Deaktivasi

```bash
deactivate
```

### Menjalankan Script Python

```bash
# Dengan virtual environment aktif
cd python
source .venv/bin/activate
python predict_silent.py '{"matematika": 85, ...}'

# Atau dalam satu baris
cd python && source .venv/bin/activate && python predict_silent.py '{"matematika": 85, ...}'
```

## Konfigurasi Laravel

Laravel telah dikonfigurasi untuk menggunakan virtual environment otomatis:

### Local Environment
- Jika `.venv` ada: menggunakan virtual environment
- Jika tidak ada: fallback ke system Python

### Production Environment
- Selalu menggunakan virtual environment

### Environment Variables

```env
# .env file
PYTHON_VENV_PATH="${PWD}/python/.venv"
```

## Dependency Management

### requirements.txt
```txt
pandas==2.1.4
numpy==1.24.4
scikit-learn==1.3.2
joblib==1.3.2
mysql-connector-python==8.2.0
python-dotenv==1.0.0
```

### Menambah Dependency Baru

```bash
# Aktifkan virtual environment
cd python
source .venv/bin/activate

# Install package baru
pip install package-name==version

# Update requirements.txt
pip freeze > requirements.txt
```

## Testing

### Test Python Environment

```bash
cd python
source .venv/bin/activate
python -c "
import pandas as pd
import numpy as np
import sklearn
import joblib
import mysql.connector
from dotenv import load_dotenv
print('✅ All dependencies working!')
"
```

### Test Prediction Script

```bash
cd python
source .venv/bin/activate
python predict_silent.py '{"matematika": 85, "bahasa_indonesia": 80, "bahasa_inggris": 90, "fisika": 88, "kimia": 87, "biologi": 85, "sejarah": 78, "geografi": 79, "ekonomi": 82, "sosiologi": 80, "pkn": 83, "seni_budaya": 75, "prakarya": 77, "pjok": 85, "peminatan_1": 88, "peminatan_2": 86, "rata_rata_keseluruhan": 82, "rencana_kuliah": "Iya", "kategori_jurusan": "Saintek", "tingkat_keyakinan": 85}'
```

### Test dari Laravel

```bash
# Test melalui web interface
php artisan serve

# Atau test langsung
php artisan tinker
>>> app(\App\Http\Controllers\PrediksiKNNController::class)->predict();
```

## Troubleshooting

### Virtual Environment Tidak Terdeteksi

```bash
# Periksa path
ls -la python/.venv

# Recreate virtual environment
cd python
rm -rf .venv
./setup_local.sh
```

### Python Dependencies Error

```bash
# Reinstall dependencies
cd python
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

### Permission Error

```bash
# Fix permissions
chmod +x python/setup_local.sh
chmod +x python/activate_venv.sh
```

### Database Connection Error

1. Pastikan MySQL running
2. Periksa kredensial di `.env`
3. Test koneksi:

```bash
cd python
source .venv/bin/activate
python -c "
from dotenv import load_dotenv
import os
load_dotenv('../.env')
print('DB Host:', os.getenv('DB_HOST'))
print('DB Database:', os.getenv('DB_DATABASE'))
print('DB Username:', os.getenv('DB_USERNAME'))
"
```

## Production Deployment

Untuk production di Digital Ocean, gunakan script terpisah:

```bash
# Upload dan jalankan di server
scp python/setup_python_do.sh user@server:/path/to/app/python/
ssh user@server
cd /path/to/app/python
chmod +x setup_python_do.sh
./setup_python_do.sh
```

## Best Practices

1. **Selalu gunakan virtual environment** untuk development
2. **Jangan commit .venv/** ke git
3. **Update requirements.txt** setelah install package baru
4. **Test script setelah setup** virtual environment
5. **Gunakan versi Python yang konsisten** (3.11+ recommended)
6. **Backup requirements.txt** sebelum update major