# CircularFund - Quick Start Guide

Panduan cepat untuk mulai development dalam 15 menit!

---

## 🎯 Apa itu CircularFund?

Platform yang menghubungkan **UMKM** yang menerapkan ekonomi sirkular dengan **Investor** yang ingin mendanai bisnis berkelanjutan. AI memberikan skor 0-100 berdasarkan 8 indikator praktik sirkular.

**Flow Sederhana:**
```
UMKM → Submit praktik sirkular + bukti → AI scoring → Dapat skor → Visible ke investor
Investor → Browse UMKM → Filter by skor → Lihat detail → Kontak untuk pendanaan
```

---

## ⚡ Setup Super Cepat (15 menit)

### 1. Prerequisites (5 menit)
```bash
# Check versions
node --version    # Need 18+
python --version  # Need 3.10+
psql --version    # Need 15+

# If not installed:
# - Node.js: https://nodejs.org
# - Python: https://python.org
# - PostgreSQL: https://postgresql.org
```

### 2. Clone & Setup Database (3 menit)
```bash
# Clone repo
git clone https://github.com/yourusername/circularfund.git
cd circularfund

# Create database
createdb circularfund

# Run schema
psql -d circularfund -f database/schema.sql
```

### 3. Start Backend (3 menit)
```bash
cd backend
npm install
cp .env.example .env

# Edit .env - minimal config:
# DATABASE_URL=postgresql://postgres:password@localhost:5432/circularfund
# JWT_SECRET=your-secret-key

npm run start:dev
# ✅ Backend running on http://localhost:4000
```

### 4. Start AI Service (2 menit)
```bash
cd ai-service
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python main.py
# ✅ AI Service running on http://localhost:5000
```

### 5. Test API (2 menit)
```bash
# Test scoring endpoint
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

# Should return score around 60-70 ✅
```

---

## 🚀 Development Workflow

### Daily Development
```bash
# Terminal 1: Backend
cd backend && npm run start:dev

# Terminal 2: AI Service
cd ai-service && venv\Scripts\activate && python main.py

# Terminal 3: Frontend (when ready)
cd frontend && npm run dev
```

### Or use batch script (Windows):
```bash
start-services.bat
```

---

## 📁 Key Files to Know

```
circularfund/
├── backend/src/
│   ├── scoring/scoring.service.ts    # ⭐ Core scoring logic
│   ├── auth/auth.service.ts          # Authentication
│   └── app.module.ts                 # Main module
├── ai-service/
│   └── main.py                       # ⭐ AI validation
├── database/
│   └── schema.sql                    # ⭐ Database structure
└── docs/
    ├── product-requirements.md       # 📋 What to build
    ├── technical-specification.md    # 🏗️ How to build
    └── implementation-guide.md       # 🛠️ Step-by-step
```

---

## 🎓 Learning Path

### Day 1: Understand the System
1. Read [Product Requirements](docs/product-requirements.md) (30 min)
2. Review [Database Schema](database/schema.sql) (20 min)
3. Test scoring API (10 min)

### Day 2: Backend Development
1. Read [Technical Specification](docs/technical-specification.md) (1 hour)
2. Implement Auth module (2-3 hours)
3. Test with Postman/Insomnia

### Day 3-4: UMKM Features
1. Follow [Implementation Guide](docs/implementation-guide.md) Phase 3
2. Build profile & submission endpoints
3. Integrate with scoring service

### Day 5-6: Investor Features
1. Follow Implementation Guide Phase 4
2. Build discovery & filtering
3. Implement bookmark system

### Day 7: Frontend (if needed)
1. Setup Next.js
2. Build auth pages
3. Build UMKM dashboard

### Day 8: Testing & Polish
1. Write tests
2. Fix bugs
3. Deploy to staging

---

## 🧪 Quick Test Scenarios

### Test 1: High Score UMKM
```json
{
  "resourceReductionPercentage": 30,
  "reuseFrequency": "systematic",
  "recycleType": "internal",
  "productLifespanYears": 5,
  "productRepairability": true,
  "processEfficiencyImprovement": 35,
  "documentationLevel": "comprehensive",
  "traceabilitySystem": true,
  "carbonReductionKg": 1500,
  "localEmployees": 8,
  "incomeStability": "stable"
}
```
**Expected**: Score 85-95, "High Circular Potential" ⭐

### Test 2: Low Score UMKM
```json
{
  "resourceReductionPercentage": 2,
  "reuseFrequency": "none",
  "recycleType": "none",
  "productLifespanYears": 0.5,
  "productRepairability": false,
  "processEfficiencyImprovement": 0,
  "documentationLevel": "minimal",
  "traceabilitySystem": false,
  "carbonReductionKg": 50,
  "localEmployees": 1,
  "incomeStability": "unstable"
}
```
**Expected**: Score 15-25, "Low Readiness" 🔴

### Test 3: Anomaly Detection
```json
{
  "resourceReductionPercentage": 80,
  "carbonReductionKg": 10000,
  "documentationLevel": "minimal"
}
```
**Expected**: Flags for unrealistic claims ⚠️

---

## 🐛 Common Issues & Fixes

### Issue: Database connection failed
```bash
# Fix: Check PostgreSQL is running
pg_ctl status
pg_ctl start

# Fix: Check connection string in .env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/circularfund
```

### Issue: Port already in use
```bash
# Windows: Kill process
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:4000 | xargs kill -9
```

### Issue: Module not found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: Python venv not activating
```bash
# Windows
venv\Scripts\activate

# If permission error, run PowerShell as admin:
Set-ExecutionPolicy RemoteSigned
```

---

## 📚 Essential Commands

### Backend
```bash
npm run start:dev      # Development mode
npm run build          # Build for production
npm run test           # Run tests
npm run lint           # Lint code
```

### AI Service
```bash
python main.py         # Start service
pytest                 # Run tests
pip freeze > requirements.txt  # Update dependencies
```

### Database
```bash
psql -d circularfund   # Connect to database
\dt                    # List tables
\d users               # Describe table
\q                     # Quit
```

---

## 🎯 Next Steps

After setup, choose your path:

### Path A: Full-Stack Developer
1. ✅ Complete backend (Auth → UMKM → Investor)
2. ✅ Build frontend (Next.js)
3. ✅ Deploy to production

**Follow**: [Implementation Guide](docs/implementation-guide.md)

### Path B: Backend Specialist
1. ✅ Implement all API endpoints
2. ✅ Write comprehensive tests
3. ✅ Optimize performance

**Follow**: [Technical Specification](docs/technical-specification.md)

### Path C: AI/ML Engineer
1. ✅ Enhance AI validation
2. ✅ Implement OCR
3. ✅ Add image recognition

**Follow**: [AI Prompts](docs/ai-prompts.md)

---

## 💡 Pro Tips

1. **Use AI Assistants**: Check [AI Prompts](docs/ai-prompts.md) for ready-to-use prompts
2. **Follow Checklist**: Track progress with [Project Checklist](PROJECT-CHECKLIST.md)
3. **Test Early**: Test each feature before moving to next
4. **Read Docs**: All answers are in the docs folder
5. **Ask Questions**: Better to ask than to guess wrong

---

## 🆘 Need Help?

1. **Check Documentation**: 90% of questions answered in docs/
2. **Check Checklist**: See what's done and what's next
3. **Check Issues**: Common problems in troubleshooting section
4. **Ask Team**: Create GitHub issue or ask in team chat

---

## 🎉 Success Checklist

After setup, you should be able to:
- [ ] Access backend API at http://localhost:4000
- [ ] Access AI service at http://localhost:5000
- [ ] See API docs at http://localhost:4000/api
- [ ] Test scoring endpoint successfully
- [ ] See database tables in PostgreSQL
- [ ] Run tests without errors

**All checked?** You're ready to build! 🚀

---

**Estimated Time**: 15 minutes setup + 8 weeks development
**Difficulty**: Intermediate (requires TypeScript, Python, PostgreSQL knowledge)
**Support**: Check docs/ folder for detailed guides

**Happy Coding!** 💚
