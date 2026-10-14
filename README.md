# Faraday Expeditions — Multi-Provider Marketplace Platform (Phase 1 MVP)

> **Confidential Developer Brief — Complete Phase 1 Implementation**  
> A scalable, launchable multi-provider marketplace connecting travelers with verified regional tour and expedition operators.

---

## 🌟 Executive Overview
This codebase delivers the full working **Phase 1 Production MVP** matching all 36 sections of the Confidential Developer Brief. It is built as a **Modular Monolith** with:
- **Public Discovery Website**: Next.js 14, Tailwind CSS, SEO-friendly SSR, live search & multi-criteria filtering.
- **Provider Dashboard**: Business verification onboarding, listing creation wizard, booking requests management, and direct customer messaging.
- **Admin Control Panel**: Operational RBAC, provider verification queue, listing moderation, dispute management, review moderation, and immutable audit logs.
- **Customer Mobile App**: Cross-platform React Native + Expo app with bottom tab navigation, booking tracker, and enquiry flow.
- **Modular Monolith API**: Node.js + Express + Prisma ORM + PostgreSQL / SQLite with 23 normalized database models, OpenAPI/Swagger docs, and JWT security.

---

## 🚀 Quick Start (Running Locally)

### 1. Prerequisites
- **Node.js**: v18+ or v20+
- **npm**: v9+

### 2. Launch Backend API (Port 5000)
```bash
cd backend
npm install
npm run setup     # Generates Prisma client, applies schema, and seeds database
npm start         # Starts REST API daemon on http://localhost:5000
```
- **API Health Check**: `http://localhost:5000/health`
- **Interactive OpenAPI / Swagger UI**: `http://localhost:5000/api/docs`
- **OpenAPI 3.0 JSON Spec**: `http://localhost:5000/api/docs/json`

### 3. Launch Next.js Web App (Port 3000)
```bash
cd web
npm install
npm run build     # Compiles all 14 routes
npm start         # Runs production server on http://localhost:3000
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 👥 Demo Personas & Credentials
The platform includes an **Instant 1-Click Persona Switcher** on the top navigation bar of every page, allowing immediate evaluation of all roles without manual re-typing:

| Persona | Role | Email | Password | What to Test |
| :--- | :--- | :--- | :--- | :--- |
| **Faraday Admin** | `SUPER_ADMIN` | `admin@marketplace.com` | `Admin123!` | Inspect Admin Control Panel, verify providers, moderate listings, view audit logs. |
| **Tariq Mahmood** | `OPERATIONS_ADMIN` | `ops@marketplace.com` | `Admin123!` | Operational review of applications and listing moderation queues. |
| **Apex Expeditions** | `PROVIDER` (Approved) | `apex@adventures.com` | `Marketplace123!` | Access Provider Dashboard, create new package listings, manage customer requests. |
| **Coastal Escapes** | `PROVIDER` (Approved) | `coastal@escapes.com` | `Marketplace123!` | Manage Astola island scuba diving bookings and messages. |
| **Indus Safari** | `PROVIDER` (Pending) | `safari@wildlife.com` | `Marketplace123!` | Test provider pending verification state. |
| **Sarah Jenkins** | `CUSTOMER` | `sarah@customer.com` | `Marketplace123!` | View My Bookings, chat with operators, submit verified reviews. |
| **Ali Raza** | `CUSTOMER` | `ali@customer.com` | `Marketplace123!` | Search, filter, and submit new booking enquiries. |

---

## 📦 Architecture & Key Components

```
dazzling-faraday/
├── backend/                        # Modular Monolith REST API
│   ├── prisma/
│   │   ├── schema.prisma           # 23 Normalized Database Entities
│   │   └── seed.ts                 # Full Realistic Marketplace Seed Data
│   ├── src/
│   │   ├── docs/                   # OpenAPI / Swagger Specification
│   │   ├── middleware/             # JWT Authenticate, RBAC, Error Handler
│   │   └── modules/                # Logical Domain Modules
│   │       ├── admin/              # User, Provider, Listing Moderation, KPIs
│   │       ├── auth/               # Register, Login, JWT, Password Reset
│   │       ├── bookings/           # Request Lifecycle & In-Thread Messaging
│   │       ├── categories/         # Activity Taxonomy & Icons
│   │       ├── content/            # CMS Banners & Static Content
│   │       ├── destinations/       # Geographic Taxonomy
│   │       ├── listings/           # Search, Multi-Criteria Filters, CRUD
│   │       ├── providers/          # Onboarding, Verification, Profiles
│   │       ├── reviews/            # Verified Reviews (1-5 Stars), Moderation
│   │       └── users/              # Profiles, Favourites, Notifications
│   └── Dockerfile
├── web/                            # Next.js 14 App Router (Tailwind CSS)
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx            # Public Homepage (Hero search, categories, packages)
│   │   │   ├── search/page.tsx     # Discovery Engine with Live Sidebar Filters
│   │   │   ├── listing/[slug]/     # Package Detail (Itinerary, Inclusions, Booking Modal)
│   │   │   ├── provider/[id]/      # Public Provider Storefront Profile
│   │   │   ├── account/bookings/   # Customer Bookings, Live Chat, Reviews
│   │   │   ├── account/profile/    # Customer Account & Saved Favorites
│   │   │   ├── provider/dashboard/ # Provider Control Hub & Listing Wizard
│   │   │   ├── admin/dashboard/    # Master Admin Moderation & Audit Console
│   │   │   └── (about, faq, terms, privacy, contact) # CMS Informational Pages
│   │   ├── components/layout/      # Navbar (with 1-Click Demo Switcher), Footer
│   │   └── context/                # AuthContext with Multi-Role State
│   └── Dockerfile
├── mobile/                         # React Native + Expo Customer App
│   ├── src/
│   │   ├── screens/                # HomeScreen, Search, Detail, Bookings
│   │   └── services/api.ts         # Cross-platform Mobile API Client
│   ├── App.tsx                     # Native Navigation & Booking Modal Sheet
│   └── app.json                    # Expo iOS & Android Configuration
├── docs/                           # Technical Brief Deliverables
│   ├── ARCHITECTURE.md             # Modular Monolith Architecture & Scalability
│   ├── DATABASE_SCHEMA.md          # 23 Entity Normalized ERD Specification
│   ├── API_DOCUMENTATION.md        # Complete OpenAPI & REST Endpoint Reference
│   ├── SECURITY_AND_RBAC.md        # OWASP Mitigations & Backend Authorization
│   ├── DEPLOYMENT_AND_INFRASTRUCTURE.md # Staging vs Production & Docker
│   ├── BACKUP_AND_DISASTER_RECOVERY.md  # Automated Snapshots, RTO/RPO Targets
│   ├── THIRD_PARTY_SERVICES_AND_BUDGET.md # PKR 1.5M Budget Alignment & Ownership
│   └── UAT_AND_TESTING_PLAN.md     # Section 34 Acceptance Testing Matrix
├── docker-compose.yml              # Turnkey PostgreSQL + Backend + Web
└── package.json                    # Root Orchestration Scripts
```

---

## 🧪 Section 34 Success Criteria Verification

### 1. Customer Workflow:
`Register` ➔ `Search` ➔ `Filter` ➔ `View Listing` ➔ `View Provider` ➔ `Submit Request` ➔ `Track Status` ➔ `In-Thread Messaging` ➔ `Leave Review`.
- Tested & operational on `http://localhost:3000`.

### 2. Provider Workflow:
`Register` ➔ `Submit Verification Documents` ➔ `Receive Approval` ➔ `Create Listing via Wizard` ➔ `Publish Live` ➔ `Receive Booking Request` ➔ `Accept Request` ➔ `Complete Transaction` ➔ `Receive Verified Review`.
- Tested & operational in Provider Dashboard.

### 3. Administrator Workflow:
`Manage Users (Deactivate/Reactivate)` ➔ `Verify Provider Licenses` ➔ `Moderate Listings (Publish/Reject)` ➔ `Manage Bookings & Disputes` ➔ `Moderate Reviews` ➔ `Inspect Immutable Audit Logs`.
- Tested & operational in Admin Control Panel.

---

## 🔒 Security & Client Ownership (Section 24 & 31)
- **100% Server-Side Authorization**: Permissions are verified on the backend with JWT and database state checks.
- **OWASP Compliant**: Rate limiting, Helmet security headers, bcrypt password hashing, IDOR protection.
- **Client Ownership**: All code, migrations, schemas, documentation, and infrastructure scripts remain 100% under client organizational control.
