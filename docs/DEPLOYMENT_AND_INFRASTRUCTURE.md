# Deployment & Infrastructure Documentation
## Staging vs Production Environments — Sections 28 & 31 Compliance

---

### 1. Environment Segregation Matrix

| Attribute | Staging Environment | Production Environment |
| :--- | :--- | :--- |
| **Domain** | `staging.marketplace.com` | `marketplace.com` |
| **Purpose** | Development, QA regression, client UAT acceptance | Real customer traffic & verified bookings |
| **Database** | Isolated PostgreSQL instance with anonymized seed data | Managed PostgreSQL with point-in-time recovery & read replicas |
| **Storage Bucket** | `marketplace-staging-assets` | `marketplace-prod-assets` (Encrypted at rest, Sentry protected) |
| **Access Control** | Engineering team + Client stakeholders | Strictly restricted to operations team via VPN / bastion |
| **Monitoring** | Debug logs enabled | Error tracking, APM, uptime monitors, and alerting |

---

### 2. Turnkey Docker Deployment
To launch the complete infrastructure with a single command:
```bash
# 1. Clone repository
git clone https://github.com/client-org/marketplace-platform.git
cd marketplace-platform

# 2. Launch PostgreSQL 16, Modular Monolith API, and Next.js Web App
docker-compose up -d --build

# 3. Apply schema migrations & seed realistic data
docker-compose exec backend npm run setup
```

---

### 3. Automated CI/CD Pipeline (GitHub Actions Specification)
The repository includes automated CI/CD workflows under `.github/workflows/deploy.yml`:
1. **Lint & Static Analysis**: Runs ESLint and TypeScript compilation checks across `backend`, `web`, and `mobile`.
2. **Automated Unit & Integration Tests**: Runs Jest/Supertest test suites against an ephemeral PostgreSQL service container.
3. **Container Build & Registry Push**: Builds multi-stage Docker containers with cache optimization.
4. **Zero-Downtime Deployment**: Deploys to managed cloud (e.g. AWS ECS / DigitalOcean App Platform / Render) using rolling deployment.
