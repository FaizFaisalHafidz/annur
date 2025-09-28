# Deployment Guide untuk Sistem Prediksi Jurusan K-NN

## Persiapan Server Digital Ocean

### 1. Setup Server Ubuntu 22.04 LTS

```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Install dependensi dasar
sudo apt install -y git curl wget unzip nginx mysql-server php8.2-fpm php8.2-cli php8.2-mysql php8.2-xml php8.2-mbstring php8.2-curl php8.2-zip composer nodejs npm
```

### 2. Setup Database MySQL

```bash
# Secure MySQL installation
sudo mysql_secure_installation

# Login ke MySQL
sudo mysql -u root -p

# Buat database dan user
CREATE DATABASE sistem_annur;
CREATE USER 'flashcode'@'localhost' IDENTIFIED BY 'flashcode123';
GRANT ALL PRIVILEGES ON sistem_annur.* TO 'flashcode'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Setup Python Environment

Jalankan script yang telah dibuat:

```bash
# Copy file setup_python_do.sh ke server
scp setup_python_do.sh root@68.183.186.37:/root/

# SSH ke server dan jalankan script
ssh root@68.183.186.37
cd /var/www/html/sistem-annur
chmod +x setup_python_do.sh
./setup_python_do.sh
```

### 4. Deploy Laravel Application

```bash
# Clone repository
cd /var/www/html
git clone [repository-url] sistem-annur
cd sistem-annur

# Install composer dependencies
composer install --optimize-autoloader --no-dev

# Install npm dependencies dan build
npm install
npm run build

# Setup environment
cp .env.example .env
```

Edit file `.env`:

```env
APP_NAME="Sistem Prediksi Jurusan K-NN"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=http://your-domain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sistem_annur
DB_USERNAME=flashcode
DB_PASSWORD=flashcode123

PYTHON_VENV_PATH=/var/www/html/sistem-annur/python/.venv
```

```bash
# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate --seed

# Set permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

# Cache config
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 5. Setup Nginx

Buat file konfigurasi Nginx:

```bash
sudo nano /etc/nginx/sites-available/sistem-annur
```

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html/sistem-annur/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    index index.html index.htm index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

```bash
# Aktifkan site
sudo ln -s /etc/nginx/sites-available/sistem-annur /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. Setup SSL dengan Let's Encrypt (Opsional)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Testing Deployment

### 1. Test Web Application

- Akses website melalui browser
- Test login sebagai Super Admin dan Guru BK
- Verifikasi semua menu dan fungsi berjalan normal

### 2. Test Python Scripts

```bash
# SSH ke server
ssh root@68.183.186.37

# Test Python environment
cd /var/www/html/sistem-annur/python
source .venv/bin/activate
python predict_silent.py '{"matematika": 85, "bahasa_indonesia": 80, "bahasa_inggris": 90, "ipa": 88, "ips": 75, "minat_sains": 4, "minat_teknologi": 5, "minat_seni": 2, "minat_sosial": 3, "minat_bahasa": 3, "kepribadian_analitis": 4, "kepribadian_kreatif": 3, "kepribadian_sosial": 3, "kepribadian_praktis": 4}'
```

### 3. Test Database Connectivity

```bash
# Test koneksi database dari Laravel
php artisan tinker

# Di tinker shell:
DB::connection()->getPdo();
User::count();
```

## Monitoring dan Maintenance

### 1. Setup Log Monitoring

```bash
# Monitor Laravel logs
tail -f storage/logs/laravel.log

# Monitor Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Monitor PHP-FPM logs
tail -f /var/log/php8.2-fpm.log
```

### 2. Backup Database

```bash
# Buat script backup harian
sudo nano /usr/local/bin/backup-sistem-annur.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/sistem-annur"
mkdir -p $BACKUP_DIR

mysqldump -u flashcode -pflashcode123 sistem_annur > $BACKUP_DIR/sistem_annur_$DATE.sql
gzip $BACKUP_DIR/sistem_annur_$DATE.sql

# Hapus backup yang lebih dari 7 hari
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
```

```bash
# Set executable dan tambahkan ke crontab
sudo chmod +x /usr/local/bin/backup-sistem-annur.sh
sudo crontab -e

# Tambahkan line berikut untuk backup harian jam 2 pagi:
0 2 * * * /usr/local/bin/backup-sistem-annur.sh
```

### 3. Update Application

```bash
# Script untuk update aplikasi
cd /var/www/html/sistem-annur

# Backup database sebelum update
/usr/local/bin/backup-sistem-annur.sh

# Pull latest changes
git pull origin main

# Update dependencies
composer install --optimize-autoloader --no-dev
npm install && npm run build

# Run migrations
php artisan migrate --force

# Clear and cache
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Restart services
sudo systemctl restart php8.2-fpm
sudo systemctl restart nginx
```

## Troubleshooting

### 1. Python Script Errors

```bash
# Check Python environment
cd /var/www/html/sistem-annur/python
source .venv/bin/activate
pip list

# Test individual components
python -c "import pandas; print(pandas.__version__)"
python -c "import sklearn; print(sklearn.__version__)"
python -c "import mysql.connector; print('MySQL connector OK')"
```

### 2. Permission Issues

```bash
# Fix Laravel permissions
sudo chown -R www-data:www-data /var/www/html/sistem-annur
sudo chmod -R 755 /var/www/html/sistem-annur
sudo chmod -R 775 /var/www/html/sistem-annur/storage
sudo chmod -R 775 /var/www/html/sistem-annur/bootstrap/cache
```

### 3. Database Connection Issues

```bash
# Test MySQL connection
mysql -u flashcode -pflashcode123 -h localhost sistem_annur -e "SHOW TABLES;"

# Check PHP MySQL extension
php -m | grep mysql
```

## Security Checklist

- [ ] Update sistem secara rutin
- [ ] Gunakan SSL certificate
- [ ] Setup firewall (ufw)
- [ ] Disable root SSH login
- [ ] Setup fail2ban
- [ ] Regular security audit
- [ ] Monitor logs untuk aktivitas mencurigakan
- [ ] Backup database dan file secara rutin