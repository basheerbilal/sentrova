# SENTROVA DATABASE ARCHITECTURE (MySQL 8+)

## Overview
- **Database Name**: `sentrova`
- **Engine**: `InnoDB`
- **Default Character Set**: `utf8mb4`
- **Default Collation**: `utf8mb4_unicode_ci`

---

## Entity Relationship Summary

```
admins
  ↓
admin_activity_logs (admin_id foreign key -> admins.id ON DELETE SET NULL)

packages (1)
  ↓ (1:M)
package_features (package_id foreign key -> packages.id ON DELETE CASCADE)

packages (1)
  ↓ (1:M)
quote_requests (package_id foreign key -> packages.id ON DELETE SET NULL)

services (Independent)
industries (Independent)
faqs (Independent)
testimonials (Independent)
contact_messages (Independent)
site_settings (Key-value store)
```

---

## Tables Specification

### 1. `admins`
Stores backend administrators with salted password hashes (`password_hash()`) and role permissions.
- `id`: INT UNSIGNED AUTO_INCREMENT PRIMARY KEY
- `name`: VARCHAR(100)
- `email`: VARCHAR(191) UNIQUE
- `password_hash`: VARCHAR(255)
- `role`: ENUM('super_admin', 'admin')
- `status`: ENUM('active', 'inactive')
- `last_login_at`: DATETIME NULL
- `created_at`, `updated_at`: DATETIME
- **Indexes**: `(email, status)`

### 2. `packages`
Commercial hourly CCTV monitoring packages (Essential, Growth, Ultimate).
- `id`: INT UNSIGNED AUTO_INCREMENT PRIMARY KEY
- `name`: VARCHAR(100)
- `slug`: VARCHAR(100) UNIQUE
- `subtitle`: VARCHAR(255)
- `price`: DECIMAL(10, 2)
- `currency`: VARCHAR(10) (default '$')
- `billing_unit`: VARCHAR(20) (default '/HR')
- `description`: TEXT
- `popular`: TINYINT(1) (0 or 1)
- `sort_order`: INT
- `status`: ENUM('active', 'inactive')
- **Indexes**: `(status, sort_order)`, `(slug)`

### 3. `package_features`
Detailed surveillance deliverables nested under packages.
- `id`: INT UNSIGNED AUTO_INCREMENT PRIMARY KEY
- `package_id`: INT UNSIGNED (FK -> `packages.id` ON DELETE CASCADE)
- `feature`: VARCHAR(255)
- `sort_order`: INT
- **Indexes**: `(package_id, sort_order)`

### 4. `quote_requests`
Primary sales leads CRM table.
- `id`: INT UNSIGNED AUTO_INCREMENT PRIMARY KEY
- `full_name`: VARCHAR(120)
- `business_name`: VARCHAR(150)
- `phone`: VARCHAR(50)
- `email`: VARCHAR(191)
- `location`: VARCHAR(150)
- `camera_count`: INT UNSIGNED
- `package_id`: INT UNSIGNED NULL (FK -> `packages.id` ON DELETE SET NULL)
- `message`: TEXT
- `status`: ENUM('new', 'contacted', 'in_progress', 'completed', 'cancelled')
- `admin_notes`: TEXT NULL
- **Indexes**: `(status)`, `(created_at)`, `(email)`, `(package_id)`

### 5. `contact_messages`
Website inquiries and technical questions.
- `id`: INT UNSIGNED AUTO_INCREMENT PRIMARY KEY
- `full_name`: VARCHAR(120)
- `email`: VARCHAR(191)
- `phone`: VARCHAR(50) NULL
- `subject`: VARCHAR(200)
- `message`: TEXT
- `status`: ENUM('new', 'read', 'replied', 'archived')
- `admin_notes`: TEXT NULL
- **Indexes**: `(status)`, `(created_at)`

### 6. `services`
Commercial services offerings.
- `id`, `slug`, `title`, `short_description`, `description`, `icon`, `image`, `sort_order`, `status`, `created_at`, `updated_at`

### 7. `industries`
Target market sectors (Retail, Supermarkets, Warehouses, etc.).
- `id`, `name`, `slug`, `description`, `image`, `icon`, `sort_order`, `status`, `created_at`, `updated_at`

### 8. `faqs`
Frequently asked questions and technical clarifications.
- `id`, `question`, `answer`, `sort_order`, `status`, `created_at`, `updated_at`

### 9. `testimonials`
Authentic client reviews and verification metrics.
- `id`, `customer_name`, `company_name`, `designation`, `content`, `rating`, `image`, `sort_order`, `status`

### 10. `site_settings`
Configurable corporate and SEO variables.
- `id`, `key_name` UNIQUE, `key_value`, `field_group`, `description`

### 11. `admin_activity_logs`
Security audit trail recording administrator operations with IP and User Agent.
- `id`, `admin_id` (FK -> `admins.id`), `action`, `entity`, `entity_id`, `details`, `ip_address`, `user_agent`, `created_at`
