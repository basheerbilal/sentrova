-- ==========================================================
-- SENTROVA CCTV MONITORING & REMOTE SURVEILLANCE
-- MySQL 8+ Database Schema
-- Database Name: sentrova
-- Character Set: utf8mb4
-- Collation: utf8mb4_unicode_ci
-- Storage Engine: InnoDB
-- ==========================================================

-- ----------------------------------------------------------
-- DATABASE TABLES INITIALIZATION
-- ----------------------------------------------------------

-- Disable foreign key checks during schema recreation
SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS;
SET FOREIGN_KEY_CHECKS = 0;

-- Drop existing tables in reverse dependency order
DROP VIEW IF EXISTS `faqs`;
DROP TABLE IF EXISTS `admin_activity_logs`;
DROP TABLE IF EXISTS `site_settings`;
DROP TABLE IF EXISTS `contact_messages`;
DROP TABLE IF EXISTS `quote_requests`;
DROP TABLE IF EXISTS `testimonials`;
DROP TABLE IF EXISTS `faq`;
DROP TABLE IF EXISTS `industries`;
DROP TABLE IF EXISTS `package_features`;
DROP TABLE IF EXISTS `packages`;
DROP TABLE IF EXISTS `services`;
DROP TABLE IF EXISTS `admins`;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;

-- ==========================================================
-- 1. ADMINS TABLE
-- Stores administrative users with role-based access control (RBAC)
-- ==========================================================
CREATE TABLE `admins` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL COMMENT 'Full name of the administrative user',
  `email` VARCHAR(191) NOT NULL COMMENT 'Unique login email address',
  `password_hash` VARCHAR(255) NOT NULL COMMENT 'Bcrypt or Argon2 / Scrypt hashed password',
  `salt` VARCHAR(64) NULL COMMENT 'Cryptographic salt if scrypt/PBKDF2 is used',
  `role` ENUM('super_admin', 'admin', 'operator') NOT NULL DEFAULT 'admin' COMMENT 'Role privilege tier',
  `status` ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active' COMMENT 'Account status',
  `last_login_at` DATETIME NULL DEFAULT NULL COMMENT 'Timestamp of last successful login',
  `last_login_ip` VARCHAR(45) NULL DEFAULT NULL COMMENT 'IPv4/IPv6 address of last login',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_admins_email` (`email`),
  INDEX `idx_admins_email_status` (`email`, `status`),
  INDEX `idx_admins_role` (`role`),
  INDEX `idx_admins_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Administrative users, dispatch managers, and portal operators';

-- ==========================================================
-- 2. SERVICES TABLE
-- Live surveillance solutions (Theft, Till, Loitering, Perimeter, etc.)
-- ==========================================================
CREATE TABLE `services` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(120) NOT NULL COMMENT 'URL-safe identifier (e.g., customer-theft, shoplifting)',
  `title` VARCHAR(150) NOT NULL COMMENT 'Human-readable service title',
  `short_description` VARCHAR(255) NOT NULL COMMENT 'Concise overview for cards and badges',
  `description` LONGTEXT NOT NULL COMMENT 'Detailed technical operational breakdown',
  `icon` VARCHAR(60) NOT NULL DEFAULT 'ShieldAlert' COMMENT 'Lucide icon identifier',
  `image` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Optional hero or card graphic asset path',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT 'Display ranking order',
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active' COMMENT 'Publication status',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_services_slug` (`slug`),
  INDEX `idx_services_status_sort` (`status`, `sort_order`),
  INDEX `idx_services_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Core surveillance capabilities and operational modules';

-- ==========================================================
-- 3. PACKAGES TABLE
-- Hourly monitoring rate tiers (Essential, Growth, Ultimate)
-- ==========================================================
CREATE TABLE `packages` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL COMMENT 'Package title (e.g., ESSENTIAL, GROWTH, ULTIMATE)',
  `slug` VARCHAR(100) NOT NULL COMMENT 'URL-friendly package slug',
  `subtitle` VARCHAR(255) NOT NULL COMMENT 'Target scope (e.g., Customer + Staff Monitoring)',
  `price` DECIMAL(10, 2) NOT NULL COMMENT 'Hourly rate per active monitoring hour (e.g., 1.99, 2.99, 5.99)',
  `currency` VARCHAR(10) NOT NULL DEFAULT '$' COMMENT 'Currency symbol ($ or £)',
  `billing_unit` VARCHAR(20) NOT NULL DEFAULT '/HR' COMMENT 'Billing frequency (/HR, /MO)',
  `description` TEXT NULL COMMENT 'Comprehensive tier summary',
  `popular` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '1 if featured as Most Popular badge, else 0',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT 'Display ordering',
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active' COMMENT 'Availability status',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_packages_slug` (`slug`),
  INDEX `idx_packages_status_sort` (`status`, `sort_order`),
  INDEX `idx_packages_popular` (`popular`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Hourly surveillance packages and service-level agreements';

-- ==========================================================
-- 4. PACKAGE FEATURES TABLE
-- Normalized line-item capabilities associated with each package
-- ==========================================================
CREATE TABLE `package_features` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `package_id` INT UNSIGNED NOT NULL COMMENT 'Foreign key to parent package',
  `feature` VARCHAR(255) NOT NULL COMMENT 'Feature or checklist description',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT 'Display ordering within package card',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_pkg_features_pkg` (`package_id`, `sort_order`),
  CONSTRAINT `fk_pkg_features_package`
    FOREIGN KEY (`package_id`)
    REFERENCES `packages` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Checklist items and capabilities tied to monitoring tiers';

-- ==========================================================
-- 5. INDUSTRIES TABLE
-- Commercial sectors (Retail, Supermarkets, Logistics, Construction, etc.)
-- ==========================================================
CREATE TABLE `industries` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(120) NOT NULL COMMENT 'Sector title (e.g., Retail Stores, Warehouses)',
  `slug` VARCHAR(120) NOT NULL COMMENT 'Sector URL slug',
  `description` TEXT NOT NULL COMMENT 'Vulnerability risks and sector playbook overview',
  `icon` VARCHAR(60) NOT NULL DEFAULT 'Building2' COMMENT 'Lucide icon name',
  `image` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Optional sector hero photography',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT 'Display sorting index',
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active' COMMENT 'Publish status',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_industries_slug` (`slug`),
  INDEX `idx_industries_status_sort` (`status`, `sort_order`),
  INDEX `idx_industries_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Commercial sector verticals and specialized threat playbooks';

-- ==========================================================
-- 6. FAQ TABLE
-- Frequently Asked Questions for client education & SEO
-- ==========================================================
CREATE TABLE `faq` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `question` VARCHAR(255) NOT NULL COMMENT 'Client question header',
  `answer` TEXT NOT NULL COMMENT 'Comprehensive answer text',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT 'Display ordering index',
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active' COMMENT 'Publish status',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_faq_status_sort` (`status`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Frequently asked questions regarding compatibility, contracts, and SLAs';

-- ==========================================================
-- 7. TESTIMONIALS TABLE
-- Verified customer social proof, shrink reduction stats, and reviews
-- ==========================================================
CREATE TABLE `testimonials` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `customer_name` VARCHAR(120) NOT NULL COMMENT 'Client executive or store owner name',
  `company_name` VARCHAR(150) NOT NULL COMMENT 'Business or chain name',
  `designation` VARCHAR(100) NULL DEFAULT NULL COMMENT 'Role (e.g., Managing Director, Head of Security)',
  `content` TEXT NOT NULL COMMENT 'Verbatim testimonial statement',
  `rating` TINYINT UNSIGNED NOT NULL DEFAULT 5 COMMENT 'Star rating between 1 and 5',
  `image` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Client avatar or store facade photo path',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT 'Display order ranking',
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active' COMMENT 'Review status',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_testimonials_status_sort` (`status`, `sort_order`),
  INDEX `idx_testimonials_rating` (`rating`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Verified commercial client testimonials and reviews';

-- ==========================================================
-- 8. QUOTE REQUESTS TABLE
-- Leads, site audit inquiries, camera counts, and pricing requests
-- ==========================================================
CREATE TABLE `quote_requests` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(120) NOT NULL COMMENT 'Primary contact person',
  `business_name` VARCHAR(150) NOT NULL COMMENT 'Facility / store trading name',
  `phone` VARCHAR(50) NOT NULL COMMENT 'Contact phone or WhatsApp number',
  `email` VARCHAR(191) NOT NULL COMMENT 'Business email address',
  `location` VARCHAR(150) NULL DEFAULT NULL COMMENT 'Store city, borough, or postcode',
  `camera_count` INT UNSIGNED NOT NULL DEFAULT 1 COMMENT 'Number of cameras to be monitored',
  `package_id` INT UNSIGNED NULL DEFAULT NULL COMMENT 'Selected monitoring tier foreign key',
  `message` TEXT NULL COMMENT 'Site details, monitoring hours, or security concerns',
  `status` ENUM('new', 'contacted', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'new' COMMENT 'CRM lead lifecycle pipeline status',
  `admin_notes` TEXT NULL COMMENT 'Internal notes and follow-up chronology',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_quotes_status` (`status`),
  INDEX `idx_quotes_email` (`email`),
  INDEX `idx_quotes_created_at` (`created_at`),
  INDEX `idx_quotes_package_id` (`package_id`),
  CONSTRAINT `fk_quote_package`
    FOREIGN KEY (`package_id`)
    REFERENCES `packages` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Prospective business leads, surveillance audit requests, and camera sizing';

-- ==========================================================
-- 9. CONTACT MESSAGES TABLE
-- General inquiries, stream compatibility checks, and partner messages
-- ==========================================================
CREATE TABLE `contact_messages` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(120) NOT NULL COMMENT 'Sender full name',
  `email` VARCHAR(191) NOT NULL COMMENT 'Sender contact email',
  `phone` VARCHAR(50) NULL DEFAULT NULL COMMENT 'Optional contact telephone number',
  `subject` VARCHAR(200) NOT NULL COMMENT 'Subject line',
  `message` TEXT NOT NULL COMMENT 'Inquiry content',
  `status` ENUM('new', 'read', 'replied', 'archived') NOT NULL DEFAULT 'new' COMMENT 'Triage status',
  `admin_notes` TEXT NULL COMMENT 'Internal operator response notes',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_contacts_status` (`status`),
  INDEX `idx_contacts_email` (`email`),
  INDEX `idx_contacts_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Public contact desk submissions and technical support inquiries';

-- ==========================================================
-- 10. SITE SETTINGS TABLE
-- Global branding, hotline numbers, WhatsApp configs, and SEO meta
-- ==========================================================
CREATE TABLE `site_settings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `key_name` VARCHAR(100) NOT NULL COMMENT 'Unique programmatic configuration key',
  `key_value` LONGTEXT NULL COMMENT 'Value payload (string, markdown, or JSON)',
  `field_group` VARCHAR(50) NOT NULL DEFAULT 'general' COMMENT 'Grouping category (general, contact, branding, seo, social)',
  `description` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Human-readable explanation of configuration purpose',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_settings_key_name` (`key_name`),
  INDEX `idx_settings_key_name` (`key_name`),
  INDEX `idx_settings_field_group` (`field_group`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='CMS configuration keys, 24/7 hotline numbers, and SEO metadata';

-- ==========================================================
-- 11. ADMIN ACTIVITY LOGS TABLE
-- Complete audit trail of operator actions, status updates, and CMS edits
-- ==========================================================
CREATE TABLE `admin_activity_logs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `admin_id` INT UNSIGNED NULL DEFAULT NULL COMMENT 'Foreign key to administrator who performed action (NULL for system)',
  `action` VARCHAR(100) NOT NULL COMMENT 'Action code (e.g., login, update_quote, delete_service)',
  `entity` VARCHAR(80) NOT NULL COMMENT 'Target entity table/resource (e.g., quote_requests, services)',
  `entity_id` VARCHAR(50) NULL DEFAULT NULL COMMENT 'Primary key of the affected entity record',
  `details` TEXT NULL COMMENT 'JSON or descriptive payload detailing changes made',
  `ip_address` VARCHAR(45) NULL DEFAULT NULL COMMENT 'Client IPv4/IPv6 address',
  `user_agent` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Browser/client User-Agent string',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_activity_admin_id` (`admin_id`),
  INDEX `idx_activity_entity` (`entity`, `entity_id`),
  INDEX `idx_activity_action` (`action`),
  INDEX `idx_activity_created_at` (`created_at`),
  CONSTRAINT `fk_activity_admin`
    FOREIGN KEY (`admin_id`)
    REFERENCES `admins` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Security audit trail recording all administrative portal modifications';
