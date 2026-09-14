# 📹 SENTROVA — Commercial CCTV Monitoring System

### Enterprise Security. Intelligent Monitoring. Complete Control.

A complete full-stack commercial CCTV monitoring and administration platform designed for modern security businesses. SENTROVA combines a premium monitoring website, secure REST API, and powerful admin dashboard to manage security services, monitoring packages, customer inquiries, and business operations.

[![Next.js](https://img.shields.io/badge/Next.js-React-black?style=for-the-badge\&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=for-the-badge\&logo=typescript)](https://www.typescriptlang.org/)
[![PHP](https://img.shields.io/badge/PHP-8.3%2B-777BB4?style=for-the-badge\&logo=php\&logoColor=white)](https://www.php.net/)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=for-the-badge\&logo=mysql\&logoColor=white)](https://www.mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-UI-06B6D4?style=for-the-badge\&logo=tailwindcss\&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](#-license)

---

## 🌐 Project Overview

SENTROVA is a professional CCTV monitoring and security management solution built for commercial security providers.

The platform delivers a modern customer-facing experience with a secure administrative backend, enabling businesses to present their services, manage monitoring packages, handle customer inquiries, and maintain control over website content.

### 🎯 Core Objectives

* Deliver a premium enterprise security website.
* Provide secure administration and content management.
* Manage CCTV monitoring packages and service offerings.
* Centralize customer inquiries and business operations.
* Build a scalable architecture for future security integrations.

---

## ✨ Key Features

### 🖥️ Commercial Monitoring Website

* Premium enterprise CCTV monitoring design.
* Fully responsive desktop, tablet, and mobile interface.
* Professional security services showcase.
* Monitoring packages and pricing.
* Service details and feature highlights.
* Contact and customer inquiry forms.
* SEO-friendly page structure.
* Modern animations and polished user experience.

### 🔐 Administration System

* Secure administrator authentication.
* Dashboard with business overview.
* Manage CCTV monitoring packages.
* Create, edit, and delete services.
* Manage package features and pricing.
* Manage customer inquiries.
* Manage website content.
* Media upload management.
* Role-based access control architecture.
* Audit logging support.

### ⚙️ Backend & API

* PHP 8.3+ REST API.
* MySQL 8 relational database.
* PDO prepared statements.
* JWT-based authentication architecture.
* Request validation.
* CORS configuration.
* Centralized API responses.
* Modular controllers and models.
* Apache and Nginx compatibility.

### 🚀 Production-Oriented Architecture

* Frontend and backend separation.
* Environment-based configuration.
* Database schema and seed files.
* API documentation.
* Database relationship documentation.
* Secure upload handling.
* Scalable project structure.

---

## 🛠️ Technology Stack

| Layer           | Technology                               |
| --------------- | ---------------------------------------- |
| Frontend        | Next.js / React                          |
| Language        | TypeScript                               |
| Styling         | Tailwind CSS                             |
| Backend         | PHP 8.3+                                 |
| API             | REST API                                 |
| Database        | MySQL 8                                  |
| Authentication  | JWT                                      |
| Database Access | PDO                                      |
| Web Server      | Apache / Nginx                           |
| Package Manager | npm                                      |
| Deployment      | PHP-compatible hosting + Node.js hosting |

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────┐
│              SENTROVA PLATFORM              │
└─────────────────────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
┌──────────────────┐   ┌─────────────────────┐
│  Public Website  │   │   Admin Dashboard   │
│  Next.js / React │   │   Next.js / React   │
└────────┬─────────┘   └──────────┬──────────┘
         │                        │
         └────────────┬───────────┘
                      ▼
           ┌────────────────────┐
           │   PHP REST API     │
           │   Authentication   │
           │   Validation       │
           │   Controllers      │
           └─────────┬──────────┘
                     │
                     ▼
           ┌────────────────────┐
           │     MySQL 8        │
           │   Database Layer   │
           └────────────────────┘
```

---

## 📂 Project Structure

```text
SENTROVA/
│
├── frontend/                  # Next.js / React application
│   ├── src/
│   ├── public/
│   ├── components/
│   ├── pages/ or app/
│   ├── package.json
│   └── .env.local
│
├── backend/                   # PHP 8.3+ REST API
│   ├── config/
│   │   ├── database.php
│   │   ├── cors.php
│   │   └── jwt.php
│   │
│   ├── controllers/
│   │   ├── AuthController.php
│   │   ├── PackageController.php
│   │   ├── ServiceController.php
│   │   └── ContactController.php
│   │
│   ├── models/
│   │   ├── User.php
│   │   ├── Package.php
│   │   ├── Service.php
│   │   └── Contact.php
│   │
│   ├── routes/
│   │   └── api.php
│   │
│   ├── middleware/
│   │   ├── AuthMiddleware.php
│   │   └── RoleMiddleware.php
│   │
│   ├── helpers/
│   │   ├── Response.php
│   │   ├── Validator.php
│   │   └── AuditLogger.php
│   │
│   ├── public/
│   │   ├── index.php
│   │   └── .htaccess
│   │
│   ├── uploads/
│   └── .env
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── API_DOCUMENTATION.md
├── DATABASE.md
├── README.md
└── .gitignore
```

> The exact folder structure may vary depending on the frontend framework configuration and implementation.

---

## 🚀 Installation & Setup

### Prerequisites

Make sure the following tools are installed:

* Node.js 18+ or compatible version required by your frontend.
* npm.
* PHP 8.3 or newer.
* MySQL 8.
* Apache or Nginx.
* Git.

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/sentrova.git

cd sentrova
```

### 2. Database Configuration

Create the MySQL database:

```sql
CREATE DATABASE sentrova
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

Import the database schema and initial seed data:

```bash
mysql -u root -p sentrova < database/schema.sql

mysql -u root -p sentrova < database/seed.sql
```

### 3. Backend Configuration

Navigate to the backend directory:

```bash
cd backend
```

Create your environment file:

```bash
cp .env.example .env
```

Configure your database and API settings:

```env
APP_ENV=production

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=sentrova
DB_USER=your_db_username
DB_PASSWORD=your_secure_db_password

JWT_SECRET=your_secure_random_secret

CORS_ORIGIN=https://your-frontend-domain.com
```

**Security:** Never commit your production `.env` file or database passwords to GitHub.

### 4. Frontend Configuration

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api
```

Start development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### 5. Production Build

```bash
npm run build
npm start
```

For the PHP backend, configure your web server to point to:

```text
/backend/public
```

---

## 🌍 Deployment

### Frontend Hosting

Deploy the Next.js application on a Node.js-compatible hosting platform.

Required environment variable:

```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api
```

### Backend Hosting

Deploy the PHP API on Apache or Nginx with:

* PHP 8.3+.
* MySQL 8.
* PDO MySQL extension.
* HTTPS enabled.
* Correct document root.
* Environment variables configured.
* Secure upload permissions.

### Recommended Production Domains

```text
https://your-domain.com
https://api.your-domain.com
```

Replace these placeholders with your actual SENTROVA domains.

---

## 🔒 Security Considerations

SENTROVA is designed with security-focused backend practices.

* JWT authentication for protected API routes.
* PDO prepared statements to reduce SQL injection risk.
* Role-based authorization.
* Input validation and sanitization.
* Secure environment configuration.
* CORS restrictions.
* HTTPS deployment.
* Protected upload directory.
* Audit logging architecture.
* Secure password hashing.

### Production Security Checklist

* [ ] Change default administrator password.
* [ ] Generate a strong JWT secret.
* [ ] Configure HTTPS.
* [ ] Restrict CORS to trusted frontend origins.
* [ ] Disable production error display.
* [ ] Protect `.env` and configuration files.
* [ ] Validate uploaded file types and sizes.
* [ ] Prevent executable uploads.
* [ ] Configure database backups.
* [ ] Review authentication and authorization.
* [ ] Remove demo credentials from public documentation.

---

## 👨‍💻 Administrator Access

The admin portal is available at:

```text
/admin
/admin/login
```

### Default Credentials

> ⚠️ **Important:** The following credentials are only for initial local/demo setup. Change them immediately after first login and do not expose production credentials publicly.

```text
Email: admin@sentrova.co.uk
Password: Sentrova2026!
```

### Admin Capabilities

* Manage monitoring packages.
* Manage security services.
* Manage package features.
* View customer inquiries.
* Update website content.
* Manage media uploads.
* Access administrative settings.

---

## 📡 API Documentation

The backend provides RESTful endpoints for frontend and admin communication.

| Method | Endpoint              | Purpose                      |
| ------ | --------------------- | ---------------------------- |
| POST   | `/api/auth/login`     | Administrator login          |
| GET    | `/api/packages`       | Retrieve monitoring packages |
| POST   | `/api/packages`       | Create a package             |
| PUT    | `/api/packages/{id}`  | Update a package             |
| DELETE | `/api/packages/{id}`  | Delete a package             |
| GET    | `/api/services`       | Retrieve services            |
| POST   | `/api/services`       | Create a service             |
| PUT    | `/api/services/{id}`  | Update a service             |
| DELETE | `/api/services/{id}`  | Delete a service             |
| POST   | `/api/contact`        | Submit customer inquiry      |
| GET    | `/api/admin/contacts` | View inquiries               |

> Endpoint availability depends on the implemented backend routes. Refer to `API_DOCUMENTATION.md` for the complete API reference.

---

## 🗄️ Database

The MySQL database is designed to support:

* Administrator accounts.
* User roles.
* CCTV monitoring packages.
* Package features.
* Security services.
* Customer inquiries.
* Media uploads.
* Audit logs.

### Database Files

```text
database/
├── schema.sql
└── seed.sql
```

For detailed table definitions and relationships, see:

```text
DATABASE.md
```

---

## 🎨 Design & User Experience

SENTROVA focuses on a premium commercial security experience.

### Design Principles

* Professional enterprise visual identity.
* Clear information hierarchy.
* Responsive layouts.
* Smooth transitions.
* Accessible interface patterns.
* Consistent typography.
* Conversion-focused service presentation.
* Trust-building security messaging.

### UI Direction

```text
Modern • Professional • Secure • Responsive • Enterprise
```

---

## 📈 Future Roadmap

The architecture can be extended with advanced monitoring capabilities.

* [ ] Live CCTV camera streaming integration.
* [ ] Multi-camera monitoring dashboard.
* [ ] Customer accounts and portals.
* [ ] Camera/device management.
* [ ] Real-time alerts and notifications.
* [ ] Subscription and billing management.
* [ ] Advanced analytics and reports.
* [ ] Multi-tenant security operations.
* [ ] Mobile application.
* [ ] AI-powered video analytics integration.

> Live CCTV streaming and AI video analytics require additional camera infrastructure, streaming services, and backend integrations. They are not implied by the website/API architecture alone.

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/your-feature
```

3. Commit your changes.

```bash
git commit -m "feat: add your feature"
```

4. Push the branch.

```bash
git push origin feature/your-feature
```

5. Open a Pull Request.

---

## 📄 License

This project is proprietary software developed for SENTROVA Commercial CCTV Monitoring.

All rights reserved.

Unauthorized copying, distribution, or commercial use is prohibited without permission from the project owner.

---

## 👨‍💻 Developer

**Basheer Bilal — Web Developer / Software Engineer**

Building modern full-stack web applications with React, Next.js, PHP, MySQL, and premium user experiences.

### Tech Focus

* Full-Stack Web Development
* React & Next.js
* TypeScript
* PHP REST APIs
* MySQL Database Systems
* Admin Dashboard Development
* Responsive UI/UX

---

## ⭐ Support the Project

If you find SENTROVA useful, consider giving the repository a ⭐ star.

**SENTROVA — Secure Today. Smarter Tomorrow.** 📹🔐
