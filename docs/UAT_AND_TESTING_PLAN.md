# User Acceptance Testing (UAT) & Quality Assurance Plan
## Multi-Provider Marketplace — Section 27 & 34 Compliance

---

### 1. Verification of Section 34 Success Criteria

#### Workflow A: Customer Lifecycle
> **Target**: *Register → Search → Filter → View listing → View provider → Submit request/booking → Track status → Receive notifications → Leave review.*

| Step | Action | Expected Result | Verified Status |
| :---: | :--- | :--- | :---: |
| **A1** | Customer registers or signs in (`sarah@customer.com`) | JWT token issued; user authenticated; navbar shows profile | **PASSED** |
| **A2** | Customer enters "Hunza" in search bar | Discovery page displays matching listings in Hunza | **PASSED** |
| **A3** | Customer applies "Mountain Trekking" and budget filters | Results dynamically filter to relevant offerings | **PASSED** |
| **A4** | Customer opens "Hunza Valley 7-Day Royal Heritage" | Detail page displays photo gallery, itinerary, and inclusions | **PASSED** |
| **A5** | Customer clicks Provider profile link | Public storefront for "Apex Expeditions" displays verification badge | **PASSED** |
| **A6** | Customer clicks "Request Booking / Enquiry" | Booking modal calculates quote; generates unique reference number | **PASSED** |
| **A7** | Customer checks "My Bookings" portal | Request appears with PENDING status tag and timeline | **PASSED** |
| **A8** | Customer opens "Chat & Details" drawer | Customer sends inquiry to operator; thread updates in real-time | **PASSED** |
| **A9** | On completed trip, customer clicks "Leave Review" | 5-star review submitted; recalculates provider and listing rating | **PASSED** |

---

#### Workflow B: Provider Lifecycle
> **Target**: *Register → Submit verification → Get approved → Create listing → Publish listing → Receive request → Manage request → Complete transaction → Receive review.*

| Step | Action | Expected Result | Verified Status |
| :---: | :--- | :--- | :---: |
| **B1** | Provider registers or logs in (`apex@adventures.com`) | Enters provider portal; verification status displayed | **PASSED** |
| **B2** | Provider submits license permit & tax ID | Application queued in Admin Verification list | **PASSED** |
| **B3** | Provider receives admin approval notification | Verification status changes to APPROVED | **PASSED** |
| **B4** | Provider clicks "Create New Package" wizard | Submits title, destination, category, itinerary, and pricing | **PASSED** |
| **B5** | Offering approved by moderation team | Listing is published live to marketplace search engine | **PASSED** |
| **B6** | Customer submits booking request | Provider dashboard counter increments; shows customer details | **PASSED** |
| **B7** | Provider clicks "Accept" | Booking status updates to CONFIRMED; customer notified | **PASSED** |
| **B8** | Provider communicates via chat drawer | Responds to customer questions directly | **PASSED** |
| **B9** | Provider clicks "Mark Completed" | Booking status transitions to COMPLETED; review unlocked | **PASSED** |

---

#### Workflow C: Administrator Lifecycle
> **Target**: *Manage users → Verify providers → Moderate listings → Manage requests/bookings → Moderate reviews → Manage content → View basic analytics → Audit important actions.*

| Step | Action | Expected Result | Verified Status |
| :---: | :--- | :--- | :--- |
| **C1** | Admin signs in (`admin@marketplace.com`) | Unlocks purple Admin Control Panel navigation link | **PASSED** |
| **C2** | Admin inspects "Pending Provider Verifications" | Reviews trade license; clicks "Approve" | **PASSED** |
| **C3** | Admin inspects "Listings Pending Moderation" | Reviews package inclusions; clicks "Publish Live" | **PASSED** |
| **C4** | Admin checks "All Bookings" master table | Filter by status, search by reference number | **PASSED** |
| **C5** | Admin opens "User Management" | Inspects registered users; can toggle account active/suspended | **PASSED** |
| **C6** | Admin opens "Review Moderation" | Inspects reported reviews; can hide inappropriate content | **PASSED** |
| **C7** | Admin inspects "Audit Logs" | Immutable chronological log records actor, action, and target ID | **PASSED** |
