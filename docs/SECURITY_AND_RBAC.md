# Security & Role-Based Access Control (RBAC) Specification
## Multi-Provider Marketplace — Section 24 Compliance

---

### 1. Security Architecture Principles
In strict adherence to **Section 16 and Section 24**:
> *"Permissions must be enforced on the backend. The frontend must never be responsible for security."*

All route handlers in the modular monolith authenticate requests via cryptographically signed JWT tokens, verify active user status in the database, and enforce strict role boundaries before executing any business logic.

---

### 2. Role-Based Access Control (RBAC) Matrix

| Module / Operation | Anonymous Guest | Customer | Verified Provider | Operations Admin | Super Admin |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Browse / Search Listings** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **View Provider Profiles** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Submit Booking / Enquiry** | ❌ | ✅ | ❌ | ❌ | ✅ |
| **Cancel Own Booking** | ❌ | ✅ | ❌ | ❌ | ✅ |
| **Accept / Reject Request** | ❌ | ❌ | ✅ (Assigned) | ❌ | ✅ |
| **Mark Trip Completed** | ❌ | ❌ | ✅ (Assigned) | ❌ | ✅ |
| **Post Review** | ❌ | ✅ (Only Completed) | ❌ | ❌ | ❌ |
| **Create / Edit Listings** | ❌ | ❌ | ✅ (Own Only) | ❌ | ✅ |
| **Verify / Approve Provider** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Moderate / Publish Listings** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Moderate / Hide Reviews** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Suspend User / Provider** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **View Audit Logs & KPIs** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Modify Admin Roles** | ❌ | ❌ | ❌ | ❌ | ✅ |

---

### 3. Protection Against Common OWASP Vulnerabilities

1. **Insecure Direct Object Reference (IDOR / Broken Object-Level Authorization)**:
   - When a booking details endpoint (`GET /api/bookings/:id`) or status update endpoint is requested, the service performs an explicit database-level authorization check:
   ```typescript
   const isCustomer = booking.userId === userId;
   const isBookingProvider = booking.provider.userId === userId;
   const isAdmin = ['SUPER_ADMIN', 'OPERATIONS_ADMIN'].includes(role);
   if (!isCustomer && !isBookingProvider && !isAdmin) {
     return res.status(403).json({ success: false, message: 'Unauthorized' });
   }
   ```
2. **Password Hashing & Salt**:
   - All passwords are encrypted with `bcryptjs` using a salt work factor of 10. Cleartext passwords are never logged, returned in API responses, or stored in database tables.
3. **Cross-Site Scripting (XSS) & Content Security Policy**:
   - `helmet` middleware is mounted on the Express server to set modern HTTP security headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Strict-Transport-Security`, and `X-XSS-Protection`.
4. **Rate Limiting & Brute Force Defense**:
   - `express-rate-limit` enforces a strict threshold (300 requests per 15-minute window per IP) across all `/api/` endpoints to mitigate credential stuffing and DoS attacks.
5. **No Raw Card Data Storage**:
   - In accordance with PCI-DSS guidelines, no credit card primary account numbers (PAN), CVVs, or cardholder credentials are stored in any database field or log file.
6. **Immutable Audit Logging**:
   - Every sensitive administrative event (approving a provider, publishing or rejecting a listing, modifying booking statuses, hiding a review) writes an immutable record to the `AuditLog` table capturing the actor's ID, role, action, target entity, and timestamp.
