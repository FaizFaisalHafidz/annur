#!/bin/bash

# Script Deployment Lengkap untuk Sistem Prediksi Jurusan K-NN
# Untuk Ubuntu 22.04 LTS di Digital Ocean

set -e  # Exit on any error

echo "🚀 Memulai deployment Sistem Prediksi Jurusan K-NN..."
echo "=================================================="

# Variabel konfigurasi
DOMAIN="your-domain.com"  # Ganti dengan domain Anda
DB_NAME="sistem_annur"
DB_USER="flashcode"
DB_PASS="flashcode123"
APP_PATH="/var/www/html/sistem-annur"
PYTHON_VERSION="3.12"

# Fungsi untuk log
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Fungsi untuk error handling
error_exit() {
    echo "❌ Error: $1" >&2
    exit 1
}

# 1. Update sistem
log "📦 Mengupdate sistem..."
apt update && apt upgrade -y || error_exit "Gagal update sistem"

# 2. Install dependensi dasar
log "🔧 Menginstall dependensi dasar..."
apt install -y \
    git curl wget unzip \
    nginx \
    mysql-server \
    php8.2-fpm php8.2-cli php8.2-mysql php8.2-xml php8.2-mbstring \
    php8.2-curl php8.2-zip php8.2-gd php8.2-intl php8.2-bcmath \
    software-properties-common \
    python3.12 python3.12-venv python3.12-dev \
    python3-pip \
    pkg-config \
    default-libmysqlclient-dev \
    build-essential \
    || error_exit "Gagal install dependensi dasar"

# 3. Install Composer
log "📝 Menginstall Composer..."
if ! command -v composer &> /dev/null; then
    curl -sS https://getcomposer.org/installer | php
    mv composer.phar /usr/local/bin/composer
    chmod +x /usr/local/bin/composer
fi

# 4. Install Node.js dan npm
log "🟢 Menginstall Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

# 5. Setup MySQL
log "🗄️ Mengsetup MySQL..."
systemctl start mysql
systemctl enable mysql

# Create database dan user jika belum ada
mysql -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME};" 2>/dev/null || true
mysql -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';" 2>/dev/null || true
mysql -e "GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';" 2>/dev/null || true
mysql -e "FLUSH PRIVILEGES;" 2>/dev/null || true

# 6. Setup direktori aplikasi
log "📁 Mengsetup direktori aplikasi..."
mkdir -p /var/www/html
cd /var/www/html

# Clone atau update repository
if [ ! -d "$APP_PATH" ]; then
    log "📥 Cloning repository..."
    # Ganti dengan URL repository Anda
    # git clone https://github.com/username/sistem-annur.git sistem-annur
    echo "⚠️  Silakan clone repository secara manual ke $APP_PATH"
    echo "   git clone [repository-url] $APP_PATH"
    exit 1
fi

cd $APP_PATH

# 7. Setup Python Environment
log "🐍 Mengsetup Python environment..."
cd python

# Buat virtual environment
python3.12 -m venv .venv
source .venv/bin/activate

# Upgrade pip
pip install --upgrade pip setuptools wheel

# Install dependencies dengan versi yang kompatibel
log "📦 Menginstall Python packages..."
pip install pandas==2.1.4
pip install numpy==1.24.4  # Kompatibel dengan Python 3.12
pip install scikit-learn==1.3.2
pip install joblib==1.3.2
pip install mysql-connector-python==8.2.0
pip install python-dotenv==1.0.0

# Test Python scripts
log "🧪 Testing Python environment..."
python -c "
import pandas as pd
import numpy as np
import sklearn
import joblib
import mysql.connector
print('✅ Semua Python dependencies berhasil diinstall')
print(f'Pandas: {pd.__version__}')
print(f'NumPy: {np.__version__}')
print(f'Scikit-learn: {sklearn.__version__}')
print(f'Joblib: {joblib.__version__}')
"

cd ..

# 8. Install Laravel dependencies
log "🎼 Menginstall Laravel dependencies..."
composer install --optimize-autoloader --no-dev --no-interaction

# 9. Setup environment
log "⚙️ Mengsetup environment..."
if [ ! -f .env ]; then
    cp .env.example .env
fi

# Update .env file
cat > .env << EOF
APP_NAME="Sistem Prediksi Jurusan K-NN"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=http://${DOMAIN}

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=${DB_NAME}
DB_USERNAME=${DB_USER}
DB_PASSWORD=${DB_PASS}

PYTHON_VENV_PATH=${APP_PATH}/python/.venv

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="\${APP_NAME}"
EOF

# Generate application key
php artisan key:generate --force

# 10. Install dan build frontend assets
log "🎨 Building frontend assets..."
npm install
npm run build

# 11. Run migrations
log "🗄️ Running database migrations..."
php artisan migrate --force --seed

# 12. Setup permissions
log "🔐 Setting up permissions..."
chown -R www-data:www-data $APP_PATH
chmod -R 755 $APP_PATH
chmod -R 775 $APP_PATH/storage
chmod -R 775 $APP_PATH/bootstrap/cache
chmod +x $APP_PATH/python/.venv/bin/activate

# 13. Cache aplikasi
log "⚡ Caching application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 14. Setup Nginx
log "🌐 Mengsetup Nginx..."
cat > /etc/nginx/sites-available/sistem-annur << EOF
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};
    root ${APP_PATH}/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    index index.html index.htm index.php;

    charset utf-8;

    # Increase client max body size for file uploads
    client_max_body_size 100M;

    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php\$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME \$realpath_root\$fastcgi_script_name;
        include fastcgi_params;
        
        # Increase timeout for long-running requests
        fastcgi_read_timeout 300;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }

    # Static assets caching
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)\$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Hapus default site dan aktifkan site baru
rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/sistem-annur /etc/nginx/sites-enabled/

# Test konfigurasi nginx
nginx -t || error_exit "Konfigurasi Nginx tidak valid"

# 15. Setup PHP-FPM
log "🐘 Mengkonfigurasi PHP-FPM..."
sed -i 's/;max_execution_time = 30/max_execution_time = 300/' /etc/php/8.2/fpm/php.ini
sed -i 's/;max_input_time = 60/max_input_time = 300/' /etc/php/8.2/fpm/php.ini
sed -i 's/memory_limit = 128M/memory_limit = 512M/' /etc/php/8.2/fpm/php.ini
sed -i 's/upload_max_filesize = 2M/upload_max_filesize = 100M/' /etc/php/8.2/fpm/php.ini
sed -i 's/post_max_size = 8M/post_max_size = 100M/' /etc/php/8.2/fpm/php.ini

# 16. Setup firewall dasar
log "🔥 Mengsetup firewall..."
ufw --force enable
ufw allow ssh
ufw allow 'Nginx Full'

# 17. Start dan enable services
log "🔄 Starting services..."
systemctl restart php8.2-fpm
systemctl restart nginx
systemctl enable php8.2-fpm
systemctl enable nginx

# 18. Setup backup script
log "💾 Setup backup script..."
mkdir -p /var/backups/sistem-annur

cat > /usr/local/bin/backup-sistem-annur.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/sistem-annur"
mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u flashcode -pflashcode123 sistem_annur > $BACKUP_DIR/sistem_annur_$DATE.sql
gzip $BACKUP_DIR/sistem_annur_$DATE.sql

# Backup file aplikasi (exclude node_modules dan vendor)
tar --exclude='node_modules' --exclude='vendor' --exclude='.git' \
    -czf $BACKUP_DIR/files_$DATE.tar.gz -C /var/www/html sistem-annur

# Hapus backup yang lebih dari 7 hari
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "$(date '+%Y-%m-%d %H:%M:%S') - Backup completed: $DATE"
EOF

chmod +x /usr/local/bin/backup-sistem-annur.sh

# Tambah ke crontab untuk backup harian
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-sistem-annur.sh >> /var/log/backup-sistem-annur.log 2>&1") | crontab -

# 19. Final test
log "🧪 Running final tests..."

# Test database connection
cd $APP_PATH
php artisan tinker --execute="echo 'DB Connection: ' . (DB::connection()->getPdo() ? 'OK' : 'FAILED') . PHP_EOL;"

# Test Python scripts
cd python
source .venv/bin/activate
python predict_silent.py '{"matematika": 85, "bahasa_indonesia": 80, "bahasa_inggris": 90, "ipa": 88, "ips": 75, "minat_sains": 4, "minat_teknologi": 5, "minat_seni": 2, "minat_sosial": 3, "minat_bahasa": 3, "kepribadian_analitis": 4, "kepribadian_kreatif": 3, "kepribadian_sosial": 3, "kepribadian_praktis": 4}' || log "⚠️  Python test failed - check configuration"

cd ..

echo ""
echo "✅ Deployment berhasil!"
echo "=================================================="
echo "🌐 Website: http://${DOMAIN}"
echo "📁 App Path: ${APP_PATH}"
echo "🗄️ Database: ${DB_NAME}"
echo "👤 DB User: ${DB_USER}"
echo "🐍 Python: ${APP_PATH}/python/.venv"
echo ""
echo "📝 Langkah selanjutnya:"
echo "1. Update DNS untuk domain ${DOMAIN} ke IP server ini"
echo "2. Setup SSL dengan: certbot --nginx -d ${DOMAIN}"
echo "3. Buat user admin pertama melalui web interface"
echo "4. Test semua fungsi aplikasi"
echo ""
echo "📊 Status Services:"
systemctl is-active nginx && echo "✅ Nginx: Running" || echo "❌ Nginx: Not Running"
systemctl is-active php8.2-fpm && echo "✅ PHP-FPM: Running" || echo "❌ PHP-FPM: Not Running"
systemctl is-active mysql && echo "✅ MySQL: Running" || echo "❌ MySQL: Not Running"
echo ""
echo "📋 Monitoring logs:"
echo "Laravel: tail -f ${APP_PATH}/storage/logs/laravel.log"
echo "Nginx: tail -f /var/log/nginx/error.log"
echo "PHP-FPM: tail -f /var/log/php8.2-fpm.log"
echo ""
echo "🔐 Jangan lupa untuk:"
echo "- Ganti default passwords"
echo "- Setup SSL certificate"
echo "- Review security settings"
echo "- Test backup script"