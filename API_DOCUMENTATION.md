# SENTROVA Commercial CCTV Monitoring — REST API Documentation

Comprehensive technical documentation for the SENTROVA Remote CCTV Surveillance and Active Human Deterrence RESTful API. This specification details authentication requirements, public customer-facing routes, protected administrative endpoints, request/response JSON schemas, error codes, and audit logging.

---

## Table of Contents

1. [Architecture & Protocol Standards](#1-architecture--protocol-standards)
2. [Authentication & Authorization](#2-authentication--authorization)
3. [Standard Response Format](#3-standard-response-format)
4. [Public Endpoints](#4-public-endpoints)
   - [4.1 Health Check](#41-health-check)
   - [4.2 Services](#42-get-apiservices)
   - [4.3 Pricing Packages](#43-get-apipackages)
   - [4.4 Industry Verticals](#44-get-apiindustries)
   - [4.5 Frequently Asked Questions](#45-get-apifaqs)
   - [4.6 Client Testimonials](#46-get-apitestimonials)
   - [4.7 Site Settings](#47-get-apisettings)
   - [4.8 Submit Quote Request (Lead Generation)](#48-post-apiquote-request)
   - [4.9 Submit Contact Message](#49-post-apicontact)
5. [Admin Authentication](#5-admin-authentication)
   - [5.1 Admin Login](#51-post-apiadminlogin)
   - [5.2 Admin Profile Verification](#52-get-apiadminme)
   - [5.3 Admin Logout](#53-post-apiadminlogout)
6. [Protected Admin Management Routes](#6-protected-admin-management-routes)
   - [6.1 Executive Dashboard Metrics](#61-get-apiadmindashboard)
   - [6.2 Quote Requests CRM](#62-quote-requests-crm)
   - [6.3 Contact Messages Triage](#63-contact-messages-triage)
   - [6.4 Pricing Packages & Feature Line Items](#64-pricing-packages--features)
   - [6.5 Surveillance Services CMS](#65-surveillance-services-cms)
   - [6.6 Industry Sectors CMS](#66-industry-sectors-cms)
   - [6.7 FAQ Management CMS](#67-faq-management-cms)
   - [6.8 Testimonials CMS](#68-testimonials-cms)
   - [6.9 Site Settings CMS](#69-site-settings-cms)
7. [Security & Activity Audit Trail](#7-security--activity-audit-trail)
8. [Error Codes & Troubleshooting](#8-error-codes--troubleshooting)

---

## 1. Architecture & Protocol Standards

- **Base URL (Local/Development)**: `http://localhost:3000/api`
- **Base URL (Production)**: `/api` (served directly behind the reverse proxy)
- **Data Serialization**: JSON (`application/json`) with `UTF-8` encoding.
- **HTTP Methods**: Standard REST verbs (`GET`, `POST`, `PUT`, `DELETE`).
- **Idempotency**: All `GET`, `PUT`, and `DELETE` endpoints are idempotent.

---

## 2. Authentication & Authorization

Protected endpoints under `/api/admin/*` require a valid JSON Web Token (JWT) in the HTTP `Authorization` request header using the standard `Bearer` scheme.

### Header Format

```http
Authorization: Bearer <jwt_access_token>
```

### Token Attributes

| Attribute | Specification |
|:---|:---|
| **Algorithm** | HMAC-SHA256 (`HS256`) |
| **Token Issuer** | `sentrova-surveillance-auth` |
| **Default Lifetime** | 7 days (604,800 seconds) |
| **Payload Claims** | `admin_id` (number), `email` (string), `role` (`super_admin` \| `admin` \| `operator`) |

### Role-Based Access Control (RBAC)

- **`super_admin`**: Full system permissions, site settings modifications, user management.
- **`admin`**: Full CRM lead updates, package/service content edits, testimonial and FAQ publishing.
- **`operator`**: Read-only CRM views and status notation updates.

---

## 3. Standard Response Format

All API responses strictly adhere to a predictable envelope schema.

### Success Response (HTTP 200 OK / 201 Created)

```json
{
  "success": true,
  "message": "Request successful",
  "data": {}
}
```

### Error Response (HTTP 400, 401, 403, 404, 422, 500)

```json
{
  "success": false,
  "message": "Human-readable error description",
  "errors": {
    "field_name": "Field-specific validation reason"
  }
}
```

---

## 4. Public Endpoints

Public endpoints require no authentication headers and are consumed by the public client application.

### 4.1 Health Check

```http
GET /api/health
```

Checks database connectivity and server uptime.

**Response `(200 OK)`**:
```json
{
  "status": "ok",
  "timestamp": "2026-09-06T14:25:00.000Z",
  "service": "Sentrova Surveillance API",
  "environment": "production"
}
```

---

### 4.2 `GET /api/services`

Retrieves all active commercial monitoring services ordered by display ranking.

**Query Parameters**: None.

**Response `(200 OK)`**:
```json
{
  "success": true,
  "message": "Request successful",
  "data": [
    {
      "id": 1,
      "slug": "customer-theft",
      "title": "Customer Theft Monitoring",
      "short_description": "Active visual tracking of sales floor activity to identify concealment, tag tampering, and unpaid items.",
      "description": "Our proactive operators monitor high-shrink merchandise aisles...",
      "icon": "ShieldAlert",
      "image": null,
      "sort_order": 1,
      "status": "active",
      "created_at": "2026-09-06T12:00:00.000Z",
      "updated_at": "2026-09-06T12:00:00.000Z"
    }
  ]
}
```

---

### 4.3 `GET /api/packages`

Returns all active pricing tiers along with their embedded feature checklists.

**Response `(200 OK)`**:
```json
{
  "success": true,
  "message": "Request successful",
  "data": [
    {
      "id": 1,
      "name": "ESSENTIAL",
      "slug": "essential",
      "subtitle": "Customer Theft Monitoring",
      "price": 1.99,
      "currency": "$",
      "billing_unit": "/HR",
      "description": "Dedicated customer-facing surveillance to identify concealment...",
      "popular": false,
      "sort_order": 1,
      "status": "active",
      "features": [
        { "id": 1, "package_id": 1, "feature": "Store Theft Detection", "sort_order": 1 },
        { "id": 2, "package_id": 1, "feature": "Shoplifting Monitoring", "sort_order": 2 },
        { "id": 7, "package_id": 1, "feature": "Instant Theft Alerts", "sort_order": 7 }
      ]
    },
    {
      "id": 2,
      "name": "GROWTH",
      "slug": "growth",
      "subtitle": "Customer + Staff Monitoring",
      "price": 2.99,
      "currency": "$",
      "billing_unit": "/HR",
      "popular": true,
      "sort_order": 2,
      "status": "active",
      "features": []
    }
  ]
}
```

---

### 4.4 `GET /api/industries`

Returns commercial sector playbooks and risk profiles.

**Response `(200 OK)`**:
```json
{
  "success": true,
  "message": "Request successful",
  "data": [
    {
      "id": 1,
      "name": "Retail Stores",
      "slug": "retail-stores",
      "description": "High-shrink boutiques, apparel, consumer electronics, and footwear chains.",
      "icon": "ShoppingBag",
      "image": null,
      "sort_order": 1,
      "status": "active"
    }
  ]
}
```

---

### 4.5 `GET /api/faqs`

Returns customer frequently asked questions.

**Response `(200 OK)`**:
```json
{
  "success": true,
  "message": "Request successful",
  "data": [
    {
      "id": 1,
      "question": "Do I need to purchase new CCTV cameras or hardware to use Sentrova?",
      "answer": "No. Sentrova connects directly to 99% of existing CCTV systems...",
      "sort_order": 1,
      "status": "active"
    }
  ]
}
```

---

### 4.6 `GET /api/testimonials`

Returns verified commercial customer reviews.

**Response `(200 OK)`**:
```json
{
  "success": true,
  "message": "Request successful",
  "data": [
    {
      "id": 1,
      "customer_name": "Marcus Vance",
      "company_name": "Vance Superstores Ltd",
      "designation": "Managing Director",
      "content": "Within the first 3 weeks of connecting our 14 stores to Sentrova, inventory shrinkage dropped by 78%...",
      "rating": 5,
      "image": null,
      "sort_order": 1,
      "status": "active"
    }
  ]
}
```

---

### 4.7 `GET /api/settings`

Returns global company branding, 24/7 hotline numbers, and SEO metadata.

**Response `(200 OK)`**:
```json
{
  "success": true,
  "message": "Request successful",
  "data": {
    "company_name": "SENTROVA Surveillance",
    "phone": "+44 7742 476163",
    "whatsapp": "+44 7448 871603",
    "email": "monitoring@sentrova.co.uk",
    "address": "71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom",
    "hero_title": "Real-Time Remote CCTV Monitoring for UK Retail & Business",
    "whatsapp_message": "Hello SENTROVA, I would like to know more about your CCTV monitoring services."
  }
}
```

---

### 4.8 `POST /api/quote-request`

*Alias: `POST /api/quote-requests`*

Submits an inquiry for a free site audit, camera monitoring quote, or plan inquiry.

#### Request Body
```json
{
  "full_name": "Marcus Vance",
  "business_name": "Vance Retail Group",
  "phone": "+44 7742 476163",
  "email": "m.vance@vanceretail.co.uk",
  "location": "Covent Garden, London",
  "camera_count": 16,
  "package_id": 2,
  "message": "Looking to cover our 2 flagship branches during peak shopping hours and overnight."
}
```

| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `full_name` | string | Yes | Contact person name |
| `business_name` | string | Yes | Trading business or facility name |
| `phone` | string | Yes | Phone or mobile number |
| `email` | string | Yes | Contact email address |
| `location` | string | No | City or postal area |
| `camera_count` | number | No | Number of cameras to monitor (default: 1) |
| `package_id` | number | No | Target package ID (e.g. 1, 2, 3) |
| `message` | string | No | Additional operational requirements |

#### Response `(201 Created)`
```json
{
  "success": true,
  "message": "Thank you. Your quote request has been received.",
  "data": {
    "id": 4
  }
}
```

#### Validation Error `(422 Unprocessable Entity)`
```json
{
  "success": false,
  "message": "Please provide full name, business name, phone, and email.",
  "errors": {
    "email": "Email is required"
  }
}
```

---

### 4.9 `POST /api/contact`

*Alias: `POST /api/contact-messages`*

Submits a general customer service or technical compatibility inquiry.

#### Request Body
```json
{
  "full_name": "Helen Ward",
  "email": "helen.ward@wardlogistics.com",
  "phone": "+44 7700 900444",
  "subject": "Dahua NVR Stream RTSP Compatibility",
  "message": "We have 3 Dahua NVRs at our distribution depot. Does Sentrova support live ONVIF stream ingest?"
}
```

| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `full_name` | string | Yes | Sender name |
| `email` | string | Yes | Valid email address |
| `phone` | string | No | Telephone number |
| `subject` | string | Yes | Inquiry subject |
| `message` | string | Yes | Message body |

#### Response `(201 Created)`
```json
{
  "success": true,
  "message": "Thank you. Your message has been sent to our operations team.",
  "data": {
    "id": 5
  }
}
```

---

## 5. Admin Authentication

### 5.1 `POST /api/admin/login`

Authenticates an administrative user and generates a signed JWT token.

#### Request Body
```json
{
  "email": "admin@sentrova.co.uk",
  "password": "Sentrova2026!"
}
```

#### Response `(200 OK)`
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": 1,
      "name": "Super Administrator",
      "email": "admin@sentrova.co.uk",
      "role": "super_admin"
    }
  }
}
```

#### Error Responses
- `401 Unauthorized`: Invalid email or incorrect password.
- `403 Forbidden`: Admin account deactivated or suspended.
- `422 Unprocessable Entity`: Missing email or password fields.

---

### 5.2 `GET /api/admin/me`

*Protected: Requires `Authorization: Bearer <token>`*

Retrieves the currently authenticated administrator profile.

**Response `(200 OK)`**:
```json
{
  "success": true,
  "message": "Request successful",
  "data": {
    "id": 1,
    "name": "Super Administrator",
    "email": "admin@sentrova.co.uk",
    "role": "super_admin",
    "status": "active",
    "last_login_at": "2026-09-06T14:15:30.000Z"
  }
}
```

---

### 5.3 `POST /api/admin/logout`

*Protected: Requires `Authorization: Bearer <token>`*

Records the logout event in the audit log and invalidates client-side session state.

**Response `(200 OK)`**:
```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": {}
}
```

---

## 6. Protected Admin Management Routes

All routes in this section require the `Authorization: Bearer <token>` header.

### 6.1 `GET /api/admin/dashboard`

Retrieves real-time operational statistics, quote pipeline aggregates, and recent activity logs.

**Response `(200 OK)`**:
```json
{
  "success": true,
  "message": "Request successful",
  "data": {
    "metrics": {
      "total_quotes": 24,
      "new_leads": 5,
      "in_progress": 7,
      "completed": 12,
      "contact_unread": 3,
      "contact_total": 18,
      "active_packages": 3,
      "active_services": 8
    },
    "recent_leads": [
      {
        "id": 24,
        "full_name": "Marcus Vance",
        "business_name": "Vance Superstores Ltd",
        "status": "new",
        "created_at": "2026-09-06T12:30:00.000Z"
      }
    ],
    "recent_logs": [
      {
        "id": 105,
        "admin_id": 1,
        "admin_name": "Super Administrator",
        "action": "update_quote",
        "entity": "quote_requests",
        "entity_id": "23",
        "details": "Updated quote #23 status: contacted",
        "ip_address": "127.0.0.1",
        "created_at": "2026-09-06T13:00:00.000Z"
      }
    ]
  }
}
```

---

### 6.2 Quote Requests CRM

#### `GET /api/admin/quotes`
Paginated search and filter of inbound leads.

**Query Parameters**:
| Parameter | Type | Default | Description |
|:---|:---|:---|:---|
| `page` | number | 1 | Current page |
| `limit` | number | 20 | Items per page (max 100) |
| `status` | string | `all` | Filter by status: `new`, `contacted`, `in_progress`, `completed`, `cancelled` |
| `package_id`| number | `all` | Filter by package ID |
| `search` | string | `""` | Search query across name, business, email, phone, location |

**Response `(200 OK)`**:
```json
{
  "success": true,
  "message": "Request successful",
  "data": {
    "records": [
      {
        "id": 1,
        "full_name": "James Mitchell",
        "business_name": "Metro Supermarkets Ltd",
        "phone": "+44 7700 900123",
        "email": "j.mitchell@metrosupermarkets.co.uk",
        "location": "Covent Garden, London",
        "camera_count": 16,
        "package_id": 2,
        "package_name": "GROWTH ($2.99 /HR)",
        "message": "Interested in after-hours coverage.",
        "status": "new",
        "admin_notes": "",
        "created_at": "2026-09-06T10:00:00.000Z",
        "updated_at": "2026-09-06T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "total_pages": 1
    }
  }
}
```

#### `GET /api/admin/quotes/:id`
Retrieves full details for a single quote request.

#### `PUT /api/admin/quotes/:id`
Updates pipeline status and administrative notes.

**Request Body**:
```json
{
  "status": "in_progress",
  "admin_notes": "Completed initial camera audit call. Customer has 12 Hikvision IP cameras. Scheduled onboarding."
}
```

#### `DELETE /api/admin/quotes/:id`
Permanently deletes a quote record from the CRM.

---

### 6.3 Contact Messages Triage

#### `GET /api/admin/contacts`
Paginated search and status filter (`new`, `read`, `replied`, `archived`).

#### `GET /api/admin/contacts/:id`
Retrieves message details.

#### `PUT /api/admin/contacts/:id`
Updates read status and notes.

**Request Body**:
```json
{
  "status": "replied",
  "admin_notes": "Sent Dahua RTSP connection protocol guide via email."
}
```

#### `DELETE /api/admin/contacts/:id`
Deletes an inquiry message.

---

### 6.4 Pricing Packages & Features

#### `GET /api/admin/packages`
Retrieves all packages including active/inactive with their feature items.

#### `GET /api/admin/packages/:id`
Retrieves a specific package by ID.

#### `PUT /api/admin/packages/:id`
Updates package pricing, subtitle, or popularity status.

**Request Body**:
```json
{
  "name": "ESSENTIAL",
  "subtitle": "Customer Theft Monitoring",
  "price": 1.99,
  "currency": "$",
  "billing_unit": "/HR",
  "description": "Updated tier description.",
  "popular": false,
  "sort_order": 1,
  "status": "active"
}
```

#### `POST /api/admin/packages/:id/features`
Adds a new capability line-item to the package.

**Request Body**:
```json
{
  "feature": "Live 2-Way Audio Deterrence Voice-Down",
  "sort_order": 6
}
```

#### `PUT /api/admin/features/:id`
Updates an existing feature title or sort order.

#### `DELETE /api/admin/features/:id`
Removes a feature from its parent package.

---

### 6.5 Surveillance Services CMS

#### `GET /api/admin/services`
Lists all services (both active and inactive) with optional `?search=` filter.

#### `POST /api/admin/services`
Creates a new surveillance service module.

**Request Body**:
```json
{
  "title": "Perimeter Drone Verification",
  "short_description": "Automated aerial perimeter scan verification during high-risk alarms.",
  "description": "Extended operational breakdown...",
  "icon": "Radio",
  "sort_order": 9,
  "status": "active"
}
```

#### `PUT /api/admin/services/:id`
Updates an existing service module.

#### `DELETE /api/admin/services/:id`
Deletes a service from the catalog.

---

### 6.6 Industry Sectors CMS

- `GET /api/admin/industries` — List all sectors.
- `POST /api/admin/industries` — Create a new sector (`name`, `description`, `icon`, `sort_order`, `status`).
- `PUT /api/admin/industries/:id` — Update industry details.
- `DELETE /api/admin/industries/:id` — Delete an industry sector.

---

### 6.7 FAQ Management CMS

- `GET /api/admin/faqs` — List all FAQs.
- `POST /api/admin/faqs` — Create FAQ item (`question`, `answer`, `sort_order`, `status`).
- `PUT /api/admin/faqs/:id` — Update FAQ question/answer.
- `DELETE /api/admin/faqs/:id` — Delete an FAQ item.

---

### 6.8 Testimonials CMS

- `GET /api/admin/testimonials` — List all reviews.
- `POST /api/admin/testimonials` — Create customer review (`customer_name`, `company_name`, `designation`, `content`, `rating`, `sort_order`, `status`).
- `PUT /api/admin/testimonials/:id` — Update review.
- `DELETE /api/admin/testimonials/:id` — Delete a review.

---

### 6.9 Site Settings CMS

#### `GET /api/admin/settings`
Returns key-value dictionary of all configuration parameters.

#### `PUT /api/admin/settings`
Updates one or more site configuration parameters.

**Request Body**:
```json
{
  "phone": "+44 7742 476163",
  "whatsapp": "+44 7448 871603",
  "email": "monitoring@sentrova.co.uk",
  "company_name": "SENTROVA Surveillance",
  "hero_title": "Real-Time Remote CCTV Monitoring for UK Retail & Business"
}
```

---

## 7. Security & Activity Audit Trail

Every mutating administrative action (create, update, delete, login, logout) automatically appends a record to the `admin_activity_logs` table.

### Audit Log Schema

| Field | Type | Description |
|:---|:---|:---|
| `id` | number | Auto-increment primary key |
| `admin_id` | number \| null | ID of administrator (null for system/public actions) |
| `admin_name` | string | Name of administrator at the time of the action |
| `action` | string | Action identifier (e.g. `login_success`, `update_quote`, `delete_service`) |
| `entity` | string | Resource table name (e.g. `quote_requests`, `services`, `auth`) |
| `entity_id` | string \| null | ID of affected entity |
| `details` | string | Description of the modification |
| `ip_address` | string | IPv4 or IPv6 client address |
| `created_at` | string | ISO 8601 UTC timestamp |

---

## 8. Error Codes & Troubleshooting

| HTTP Status | Meaning | Typical Trigger | Recommended Resolution |
|:---|:---|:---|:---|
| **`400 Bad Request`** | Malformed Request | Invalid syntax or parameters | Verify request format and parameters |
| **`401 Unauthorized`** | Authentication Required | Missing, expired, or corrupted JWT token | Re-authenticate via `POST /api/admin/login` |
| **`403 Forbidden`** | Insufficient Permissions | Account deactivated or role prohibited | Contact super administrator |
| **`404 Not Found`** | Resource Missing | Invalid ID or deleted record | Confirm resource ID via `GET` list |
| **`422 Unprocessable Entity`** | Validation Error | Missing required fields or improper types | Inspect `errors` dictionary in response |
| **`500 Internal Server Error`** | Server Fault | Unhandled exception or storage error | Inspect server console logs |

---

*Document Version: 1.2.0 | Last Updated: September 2026 | Sentrova Surveillance Operations Desk*
