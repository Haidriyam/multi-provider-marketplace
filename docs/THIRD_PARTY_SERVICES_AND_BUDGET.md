# Third-Party Services, Cost Breakdown & Client Ownership
## Multi-Provider Marketplace — Section 2 (Item 6), 30 & 31 Compliance

---

### 1. Phase 1 Budget Alignment (PKR 1.5 Million Cap)
In adherence to **Section 2, Item 6**:
> *"Keep development within approximately PKR 1.5 million for Phase 1."*

The architecture strictly avoids high-cost proprietary SaaS platforms, paid search engines (like Algolia or Elasticsearch managed clusters), microservice orchestration overhead (Kubernetes), and redundant tooling. All development and delivery assets fit within the client's PKR 1.5M budget milestone structure.

---

### 2. Third-Party Recurring Services & Infrastructure Breakdown

| Service Category | Recommended Provider | Phase 1 Tier | Estimated Monthly Cost | Ownership Registration |
| :--- | :--- | :--- | :--- | :--- |
| **Cloud Compute & App Hosting** | DigitalOcean / Render / AWS Lightsail | Standard Managed VPS (4GB RAM, 2 vCPUs) | ~$20 – $28 / mo (~PKR 8,000) | Registered in Client's Account |
| **Managed Database** | PostgreSQL 16 Managed (DigitalOcean / Neon / Supabase) | Essential Tier (with automated daily snapshots) | ~$15 / mo (~PKR 4,200) | Registered in Client's Account |
| **Object Storage (Media/Docs)** | Cloudflare R2 / AWS S3 | Standard S3-compatible (Zero egress fees with R2) | ~$5 / mo (~PKR 1,400) | Registered in Client's Account |
| **Transactional Email** | Resend / SendGrid / Amazon SES | Free Tier (Up to 3,000 emails/mo in Phase 1) | $0.00 | Registered in Client's Account |
| **SMS / OTP Gateway** | Twilio / Zong Direct API | Pay-as-you-go | ~$10 / mo (~PKR 2,800) | Registered in Client's Account |
| **Error Tracking & APM** | Sentry (Self-hosted or Developer Cloud) | Developer Free Tier (5k errors/mo) | $0.00 | Registered in Client's Account |
| **Maps & Geocoding** | Mapbox / OpenStreetMap | Generous Free Tier (50k requests/mo) | $0.00 | Registered in Client's Account |
| **App Store Developer Accounts** | Apple Developer Program<br/>Google Play Console | Annual Fee ($99)<br/>One-time Fee ($25) | Annual overhead | Client Owned Org Accounts |
| **TOTAL ESTIMATED MONTHLY RUNTIME** | | | **~$50 / mo (~PKR 14,000 / mo)** | **100% Client Owned** |

---

### 3. Client Ownership Guarantee Checklist (Section 31 Compliance)
Every core technical asset must be registered directly under the client's organization name:
- [x] **Source Code**: 100% stored in client's GitHub organization repository.
- [x] **Database & Cloud Infrastructure**: Deployed to client's cloud hosting accounts.
- [x] **Domains & DNS**: Held in client's registrar (Cloudflare / Namecheap).
- [x] **Apple & Google Developer Accounts**: Provisioned under client's corporate D-U-N-S registration.
- [x] **No Vendor Lock-in**: Standard open-source technologies (Node.js, Next.js, Prisma, PostgreSQL, React Native Expo) with zero proprietary dependencies.
