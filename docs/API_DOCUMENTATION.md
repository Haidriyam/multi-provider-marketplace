# API Specification & OpenAPI Documentation
## Multi-Provider Marketplace — Section 21 Compliance

---

### 1. Interactive Swagger UI & OpenAPI Specification
- **Interactive Swagger UI**: Available locally at `http://localhost:5000/api/docs`
- **Raw OpenAPI 3.0 JSON**: Available at `http://localhost:5000/api/docs/json`
- **Health Check**: `http://localhost:5000/health`

### 2. Authentication & Authorization Headers
All secured endpoints require the standard Bearer Token header:
```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

### 3. Core REST Endpoints Catalog

#### Authentication Module (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register customer or provider account | No |
| `POST` | `/api/auth/login` | Log in and receive JWT token + user profile | No |
| `GET` | `/api/auth/me` | Fetch currently authenticated user profile | Yes (All roles) |
| `POST` | `/api/auth/forgot-password` | Dispatches password reset token instructions | No |

#### Listings & Catalog Module (`/api/listings`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/listings` | Search and filter listings (query params: `search`, `destination`, `category`, `minPrice`, `maxPrice`, `minRating`, `verifiedOnly`, `hasDiscount`, `sortBy`) | No |
| `GET` | `/api/listings/:idOrSlug` | Retrieve full package details, day-by-day itinerary, inclusions, media, and reviews | No |
| `POST` | `/api/listings` | Create a new listing package | Yes (`PROVIDER`) |
| `GET` | `/api/listings/provider/mine` | List all offerings owned by the authenticated provider | Yes (`PROVIDER`) |
| `PATCH` | `/api/listings/:id/status` | Toggle listing status (`DRAFT`, `PENDING_APPROVAL`, `PUBLISHED`) | Yes (`PROVIDER`) |

#### Taxonomy Module (`/api/destinations` & `/api/categories`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/destinations` | List all destinations with listing count cards | No |
| `GET` | `/api/destinations/:slug` | Retrieve single destination details and active offerings | No |
| `GET` | `/api/categories` | List all activity categories and icons | No |
| `GET` | `/api/categories/:slug` | Retrieve single category details and active offerings | No |

#### Providers Module (`/api/providers`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/providers` | Public directory of approved operators | No |
| `GET` | `/api/providers/:id` | Public operator profile, ratings, and catalog | No |
| `GET` | `/api/providers/me/profile` | Retrieve provider's own business details | Yes (`PROVIDER`) |
| `PUT` | `/api/providers/me/profile` | Update bio, logo, phone, address | Yes (`PROVIDER`) |
| `POST` | `/api/providers/me/verify` | Submit trade license, tax ID, and verification docs | Yes (`PROVIDER`) |
| `GET` | `/api/providers/me/dashboard` | Provider KPI statistics, revenue, and recent requests | Yes (`PROVIDER`) |

#### Bookings & Requests Module (`/api/bookings`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/bookings` | Submit new booking / enquiry request | Yes (`CUSTOMER`) |
| `GET` | `/api/bookings/customer` | Retrieve customer booking history with status filter | Yes (`CUSTOMER`) |
| `GET` | `/api/bookings/provider` | Retrieve incoming provider requests | Yes (`PROVIDER`) |
| `GET` | `/api/bookings/:id` | Retrieve single booking details with full line items | Yes (Party / Admin) |
| `PATCH` | `/api/bookings/:id/status` | Update booking status (`CONFIRMED`, `REJECTED`, `CANCELLED`, `COMPLETED`) | Yes (Provider / Admin / Customer) |
| `POST` | `/api/bookings/:id/messages` | Send message in direct request thread | Yes (Party) |

#### Reviews & Ratings Module (`/api/reviews`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/reviews` | Submit star rating (1-5) and feedback for COMPLETED trip | Yes (`CUSTOMER`) |
| `POST` | `/api/reviews/:id/report` | Report review for administrative moderation | Yes (Any user) |
| `POST` | `/api/reviews/:id/respond` | Provider posts public reply to customer review | Yes (`PROVIDER`) |

#### Administration Module (`/api/admin`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/overview` | Platform KPIs, GMV, moderation queue counts, popular destinations | Yes (`ADMIN`) |
| `GET` | `/api/admin/providers` | Review provider verification applications | Yes (`ADMIN`) |
| `PATCH` | `/api/admin/providers/:id/verify` | Approve or Reject provider verification with notes | Yes (`ADMIN`) |
| `GET` | `/api/admin/listings` | Master moderation queue for all listings | Yes (`ADMIN`) |
| `PATCH` | `/api/admin/listings/:id/moderate` | Approve live publication or reject listing | Yes (`ADMIN`) |
| `GET` | `/api/admin/users` | Search and list all user accounts | Yes (`ADMIN`) |
| `PATCH` | `/api/admin/users/:id` | Suspend or reactivate user account, change role | Yes (`ADMIN`) |
| `GET` | `/api/admin/reviews` | Inspect reported reviews | Yes (`ADMIN`) |
| `PATCH` | `/api/admin/reviews/:id/moderate` | Hide inappropriate review or restore | Yes (`ADMIN`) |
| `GET` | `/api/admin/bookings` | Master table of all platform bookings | Yes (`ADMIN`) |
| `GET` | `/api/admin/audit-logs` | Immutable audit log of administrative and security events | Yes (`ADMIN`) |
