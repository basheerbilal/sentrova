# SENTROVA Commercial CCTV Monitoring - Full Stack System

Complete, production-ready enterprise CCTV monitoring website and administration system built with Next.js/React, TypeScript, Tailwind CSS, PHP 8.3+ REST API, and MySQL 8.

---

## Architecture Overview

```
├── frontend/ (or /src)   # Next.js / React TypeScript client application
├── backend/              # PHP 8.3+ REST API (Apache/Nginx compatible)
│   ├── config/           # Database, CORS, JWT token handling
│   ├── controllers/      # REST API controllers
│   ├── models/           # Data models with PDO prepared statements
│   ├── routes/           # REST router dispatching endpoints
│   ├── middleware/       # JWT Authentication & role middleware
│   ├── helpers/          # Response, Validator, Audit Logger
│   ├── public/           # Entry point (index.php) and .htaccess
│   └── uploads/          # Validated media uploads directory
├── database/
│   ├── schema.sql        # MySQL 8 table definitions and indexes
│   └── seed.sql          # Initial data (packages, features, services, super admin)
├── API_DOCUMENTATION.md  # Complete REST API reference
└── DATABASE.md           # Database tables and relationship guide
```

---

## Step-by-Step Production Setup Guide

### 1. Database Setup (MySQL 8+)
Create the MySQL database and import the schemas:

```bash
# 1. Access MySQL
mysql -u root -p

# 2. Create the database
CREATE DATABASE sentrova CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# 3. Import schema and seeds
mysql -u root -p sentrova < database/schema.sql
mysql -u root -p sentrova < database/seed.sql
```

### 2. Configure Backend Environment
Navigate to `/backend` and create your `.env` from `.env.example`:

```bash
cp backend/.env.example backend/.env
```

Update your credentials:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=sentrova
DB_USER=your_db_username
DB_PASSWORD=your_secure_db_password
JWT_SECRET=generate_a_random_32_character_string_here
CORS_ORIGIN=https://your-frontend-domain.com
```

### 3. Apache or Nginx Configuration

#### Apache
Ensure `mod_rewrite` and `mod_headers` are enabled:
```apache
<VirtualHost *:80>
    ServerName api.sentrova.co.uk
    DocumentRoot /var/www/sentrova/backend/public

    <Directory /var/www/sentrova/backend/public>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

#### Nginx
```nginx
server {
    listen 80;
    server_name api.sentrova.co.uk;
    root /var/www/sentrova/backend/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
    }

    # Deny access to uploads with executable extensions
    location ~* /uploads/.*\.(php|phtml|phar|sh|pl|py)$ {
        deny all;
    }
}
```

### 4. Frontend Setup
In the frontend directory:
```bash
# Install dependencies
npm install

# Configure API URL in .env
echo "NEXT_PUBLIC_API_URL=https://api.sentrova.co.uk/api" > .env.local

# Run development server
npm run dev

# Or build for production
npm run build
npm start
```

### 5. Administrator Access & Changing Default Password
- **Default Super Admin**: `admin@sentrova.co.uk`
- **Initial Password**: `Sentrova2026!`
- **Access Route**: `/admin` or `/admin/login`

**Important**: Log into the admin portal and navigate to **Settings** or profile to update your password immediately after first login.
