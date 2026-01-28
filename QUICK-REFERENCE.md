# CircularFund - Quick Reference Card

## 🚀 Quick Commands

### Start Services
```bash
# All services (Windows)
start-services.bat

# Backend only
cd backend && npm run start:dev

# AI Service only
cd ai-service && venv\Scripts\activate && python main.py

# Frontend (when ready)
cd frontend && npm run dev
```

### Database
```bash
# Connect
psql -d circularfund

# Run migrations
psql -d circularfund -f database/schema.sql
psql -d circularfund -f database/migrations/002_add_notifications_table.sql

# Quick queries
\dt                                    # List tables
SELECT * FROM users LIMIT 5;          # View users
SELECT * FROM scores ORDER BY scored_at DESC LIMIT 5;  # Latest scores
```

---

## 📡 API Endpoints

### Base URLs
- Backend: `http://localhost:4000`
- AI Service: `http://localhost:5000`

### Authentication
```bash
POST /auth/register
POST /auth/login
GET  /auth/me
```

### Scoring
```bash
POST /scoring/calculate              # Calculate score
GET  /scoring/submission/:id         # Get score result
```

### UMKM
```bash
GET  /umkm/profile/:userId          # Get profile
POST /umkm/profile                  # Create profile
PUT  /umkm/profile/:id              # Update profile
GET  /umkm/dashboard/:userId        # Dashboard stats
```

### Investor
```bash
GET  /investor/umkm                 # List UMKMs (with filters)
GET  /investor/umkm/:id             # UMKM detail
POST /investor/umkm/:id/view        # Track view
POST /investor/bookmarks            # Add bookmark
GET  /investor/bookmarks            # List bookmarks
DELETE /investor/bookmarks/:id      # Remove bookmark
```

### AI Service
```bash
POST /validate                      # Validate submission
POST /estimate-carbon               # Carbon validation
POST /analyze-evidence              # Evidence analysis
```

---

## 🧪 Test Commands

### Test Scoring
```bash
curl -X POST http://localhost:4000/scoring/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "resourceReductionPercentage": 20,
    "reuseFrequency": "regular",
    "recycleType": "partner",
    "productLifespanYears": 3,
    "productRepairability": true,
    "processEfficiencyImprovement": 15,
    "documentationLevel": "basic",
    "traceabilitySystem": false,
    "carbonReductionKg": 500,
    "localEmployees": 5,
    "incomeStability": "stable"
  }'
```

### Test Investor Discovery
```bash
# Basic
curl "http://localhost:4000/investor/umkm"

# With filters
curl "http://localhost:4000/investor/umkm?sector=Fashion&minScore=60&maxScore=90&sortBy=score&page=1&limit=10"

# Multiple sectors
curl "http://localhost:4000/investor/umkm?sector=Fashion&sector=Kerajinan&province=DKI%20Jakarta"
```

### Test Carbon Validation
```bash
curl -X POST http://localhost:5000/estimate-carbon \
  -H "Content-Type: application/json" \
  -d '{
    "carbon_reduction_kg": 500,
    "calculation_method": "waste_diverted",
    "sector": "Fashion",
    "business_scale": "small",
    "evidence_count": 3,
    "details": "Mendaur ulang 250kg sampah kain per tahun"
  }'
```

---

## 📊 Scoring System

### Total Score: 0-100

| Category | Points | Indicators |
|----------|--------|------------|
| **Operational Circularity** | 60 | Resource reduction (15), Reuse (15), Recycle (10), Durability (10), Efficiency (10) |
| **Ethics & Governance** | 15 | Transparency & Traceability (15) |
| **Impact Proxy** | 25 | Carbon avoidance (15), Livelihood (10) |

### Recommendation Tags

| Score | Tag | Meaning |
|-------|-----|---------|
| 0-39 | 🔴 Low Readiness | Belum eligible |
| 40-59 | 🟡 Developing | Eligible, perlu improvement |
| 60-79 | 🟢 Ready | Praktik baik, siap didanai |
| 80-100 | ⭐ High Circular Potential | Excellent! |

---

## 🗄️ Database Quick Reference

### Key Tables
```sql
users                 -- Authentication
umkm_profiles        -- UMKM business info
investor_profiles    -- Investor info
submissions          -- Circular practice data
evidence_files       -- Evidence metadata
scores               -- Score results
bookmarks            -- Investor bookmarks
notifications        -- User notifications
profile_views        -- Analytics
```

### Useful Queries
```sql
-- Get UMKM with latest score
SELECT u.*, s.total_score, s.recommendation
FROM umkm_profiles u
LEFT JOIN LATERAL (
  SELECT total_score, recommendation
  FROM scores
  WHERE umkm_id = u.id
  ORDER BY scored_at DESC
  LIMIT 1
) s ON true
WHERE u.is_published = true;

-- Get unread notifications
SELECT * FROM notifications
WHERE user_id = 'uuid' AND is_read = FALSE
ORDER BY created_at DESC;

-- Get score history
SELECT total_score, scored_at
FROM scores
WHERE umkm_id = 'uuid'
ORDER BY scored_at ASC;
```

---

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:4000 | xargs kill -9
```

### Database Connection Error
```bash
# Check PostgreSQL status
pg_ctl status

# Restart PostgreSQL
pg_ctl restart

# Test connection
psql -U postgres -d circularfund
```

### Module Not Found
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# AI Service
cd ai-service
pip install -r requirements.txt
```

### Python venv Issues
```bash
# Windows
venv\Scripts\activate

# If permission error
Set-ExecutionPolicy RemoteSigned

# Mac/Linux
source venv/bin/activate
```

---

## 📁 Project Structure

```
circularfund/
├── backend/              # NestJS API
│   ├── src/
│   │   ├── auth/        # ✅ Authentication
│   │   ├── scoring/     # ✅ Scoring logic
│   │   ├── umkm/        # ✅ UMKM features
│   │   └── investor/    # ✅ Investor features
│   └── test/
├── ai-service/           # Python AI
│   ├── main.py          # ✅ FastAPI app
│   └── validators/      # ✅ Carbon validator
├── database/             # PostgreSQL
│   ├── schema.sql       # ✅ Main schema
│   └── migrations/      # ✅ Migrations
├── docs/                 # Documentation
│   ├── product-requirements.md
│   ├── technical-specification.md
│   ├── implementation-guide.md
│   └── ai-prompts.md
└── frontend/             # Next.js (TODO)
```

---

## 🎯 Development Workflow

### 1. Pick a Task
Check `PROJECT-CHECKLIST.md` for next priority

### 2. Use AI Prompts
Check `docs/ai-prompts.md` for ready-to-use prompts

### 3. Implement
Follow `docs/implementation-guide.md` for step-by-step

### 4. Test
```bash
# Backend tests
cd backend && npm run test

# AI service tests
cd ai-service && pytest

# Manual API tests
curl http://localhost:4000/...
```

### 5. Update Progress
Update `IMPLEMENTATION-STATUS.md`

---

## 📚 Documentation Index

| Document | Purpose |
|----------|---------|
| `README.md` | Project overview |
| `QUICK-START.md` | 15-minute setup guide |
| `QUICK-REFERENCE.md` | This file - quick commands |
| `LATEST-UPDATES.md` | Recent changes |
| `IMPLEMENTATION-STATUS.md` | Progress tracking |
| `PROJECT-CHECKLIST.md` | Development checklist |
| `docs/product-requirements.md` | What to build |
| `docs/technical-specification.md` | How to build |
| `docs/implementation-guide.md` | Step-by-step guide |
| `docs/ai-prompts.md` | AI assistant prompts |

---

## 🔑 Environment Variables

### Backend (.env)
```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/circularfund
JWT_SECRET=your-secret-key
AI_SERVICE_URL=http://localhost:5000
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=circularfund-evidence
```

### AI Service (.env)
```bash
PORT=5000
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXTAUTH_SECRET=your-secret
```

---

## 🎓 Key Concepts

### Circular Readiness Score (CRS)
AI-powered score (0-100) yang mengukur seberapa baik UMKM menerapkan praktik ekonomi sirkular berdasarkan 8 indikator.

### Evidence-Based Validation
Semua klaim harus didukung bukti (foto, dokumen, invoice). AI memvalidasi konsistensi antara klaim dan bukti.

### Industry Benchmarks
Carbon validator menggunakan benchmark industri untuk mendeteksi klaim yang tidak realistis.

### Confidence Scoring
Setiap indikator punya confidence level (0-1) berdasarkan kualitas data dan bukti.

---

## 💡 Pro Tips

1. **Use AI Prompts**: Save time dengan prompts di `docs/ai-prompts.md`
2. **Test Early**: Test setiap endpoint setelah implement
3. **Read Specs**: Semua detail ada di `docs/technical-specification.md`
4. **Track Progress**: Update `IMPLEMENTATION-STATUS.md` regularly
5. **Ask Questions**: Better to ask than to guess wrong

---

## 🆘 Need Help?

1. Check `docs/` folder for detailed guides
2. Check `IMPLEMENTATION-STATUS.md` for what's done
3. Check `PROJECT-CHECKLIST.md` for what's next
4. Check `LATEST-UPDATES.md` for recent changes
5. Check troubleshooting section above

---

**Last Updated:** January 25, 2026
**Version:** 0.40
**Progress:** 40% Complete
