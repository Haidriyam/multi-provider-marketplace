# Backup & Disaster Recovery Specification
## Data Integrity & Business Continuity — Section 29 Compliance

---

### 1. Recovery Objectives
- **Recovery Point Objective (RPO)**: < 1 Hour (Maximum acceptable data loss window).
- **Recovery Time Objective (RTO)**: < 30 Minutes (Maximum acceptable downtime to full restoration).

---

### 2. Automated Backup Strategy

| Backup Type | Frequency | Storage Location | Retention Period | Encryption |
| :--- | :--- | :--- | :--- | :--- |
| **Continuous WAL Archiving** | Real-time | Cloud Block Storage | 7 Days | AES-256 |
| **Full Database Snapshot** | Daily at 02:00 UTC | Cross-Region S3 Storage | 30 Days | KMS Managed |
| **Weekly Archive** | Every Sunday | Cold Archive Storage | 90 Days | KMS Managed |

---

### 3. Automated Backup Script (`scripts/backup_db.sh`)
```bash
#!/bin/bash
set -e

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/backups/postgres"
FILENAME="marketplace_backup_${TIMESTAMP}.sql.gz"

echo "Starting automated database backup: ${FILENAME}"
mkdir -p ${BACKUP_DIR}

# Execute pg_dump with gzip compression
pg_dump -U ${POSTGRES_USER} -h ${POSTGRES_HOST} -d ${POSTGRES_DB} | gzip > ${BACKUP_DIR}/${FILENAME}

# Sync to secure offsite S3-compatible cloud storage
aws s3 cp ${BACKUP_DIR}/${FILENAME} s3://marketplace-backups-secure/daily/${FILENAME}

# Prune local backups older than 7 days
find ${BACKUP_DIR} -name "marketplace_backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed successfully."
```

---

### 4. Step-by-Step Restoration Procedure
1. **Provision Clean Database Instance**:
   Deploy a fresh PostgreSQL 16 container or managed cluster.
2. **Download Target Snapshot**:
   ```bash
   aws s3 cp s3://marketplace-backups-secure/daily/marketplace_backup_20261014_020000.sql.gz ./latest_backup.sql.gz
   ```
3. **Execute Decompression & Import**:
   ```bash
   gunzip -c latest_backup.sql.gz | psql -U marketplace_admin -h localhost -d marketplace_db
   ```
4. **Run Prisma Migrations Verification**:
   ```bash
   cd backend && npx prisma migrate status
   ```
5. **Verify Data Integrity**:
   Verify user counts, active listings, and booking states via the `/health` and `/api/admin/overview` endpoints.
