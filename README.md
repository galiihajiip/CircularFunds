# CircularFund - Platform Pendanaan UMKM Ekonomi Sirkular

Platform digital yang menghubungkan UMKM yang menerapkan praktik ekonomi sirkular dengan investor yang ingin mendanai bisnis berkelanjutan. Menggunakan AI untuk menilai tingkat kesiapan sirkular dan memberikan skor kredibilitas.

## 🎉 Latest Updates (January 25, 2026)

**Progress: 40% Complete** (+15% today!)

### ✅ Just Implemented:
- **Investor Module** - Advanced filtering, pagination, bookmarks (Prompt #2)
- **UMKM Module** - Profile management, dashboard with stats
- **Notifications System** - Complete migration with helper functions (Prompt #3)
- **Carbon Validator** - AI validation with industry benchmarks (Prompt #4)

### 🚀 What's Working:
```bash
# Test investor discovery
curl "http://localhost:4000/investor/umkm?minScore=60&sector=Fashion&page=1"

# Test carbon validation
curl -X POST http://localhost:5000/estimate-carbon \
  -d '{"carbon_reduction_kg": 500, "sector": "Fashion", ...}'
```

See [LATEST-UPDATES.md](LATEST-UPDATES.md) for detailed changelog.

---

## 🎯 Fitur Utama

### Untuk UMKM:
- ✅ Submit praktik ekonomi sirkular (8 indikator)
- ✅ Upload bukti (foto, dokumen, invoice)
- ✅ Dapatkan skor AI (0-100) dengan breakdown detail
- ✅ Dashboard dengan rekomendasi improvement
- ✅ Profile visible ke investor setelah scored
- ✅ Track progress dengan score history

### Untuk Investor:
- ✅ Browse UMKM dengan filter (sektor, lokasi, skor)
- ✅ Lihat detail skor & bukti praktik sirkular
- ✅ Bookmark UMKM favorit
- ✅ Kontak langsung via WhatsApp/Email
- ✅ Dashboard dengan rekomendasi AI

## 🏗️ Arsitektur

```
┌─────────────────┐
│   Next.js 14    │ ← Frontend (Vercel)
│  Tailwind + UI  │
└────────┬────────┘
         │ REST API
┌────────▼────────┐
│   NestJS API    │ ← Backend (Railway)
│   TypeScript    │
└────────┬────────┘
         │ HTTP
┌────────▼────────┐
│  FastAPI (AI)   │ ← AI Scoring (Railway)
│     Python      │
└────────┬────────┘
         │
    ┌────┴────┬──────────┐
┌───▼───┐ ┌──▼──┐  ┌────▼────┐
│PostgreSQL│ │ S3  │  │OpenAI API│
└─────────┘ └─────┘  └─────────┘
```

## 📊 Sistem Scoring AI

### Total Score: 0-100 poin

**1. Operational Circularity (60 poin)**
- Resource Reduction (15 poin) - Pengurangan bahan baku/energi
- Reuse Practice (15 poin) - Frekuensi reuse material
- Recycle Integration (10 poin) - Integrasi daur ulang
- Product Durability (10 poin) - Umur produk & repairability
- Process Efficiency (10 poin) - Peningkatan efisiensi

**2. Ethics & Governance (15 poin)**
- Transparency & Traceability (15 poin) - Dokumentasi & traceability

**3. Impact Proxy (25 poin)**
- Carbon Avoidance (15 poin) - Estimasi CO2 yang dihindari
- Livelihood Impact (10 poin) - Dampak ke tenaga kerja lokal

### Recommendation Tags:
- 🔴 **Low Readiness** (0-39): Belum eligible
- 🟡 **Developing** (40-59): Eligible, perlu improvement
- 🟢 **Ready** (60-79): Praktik sirkular baik
- ⭐ **High Circular Potential** (80-100): Excellent!

### AI Features:
- ✅ Anomaly detection (klaim tidak realistis)
- ✅ Confidence scoring per indikator
- ✅ Smart suggestions untuk improvement
- ✅ Evidence quality validation
- 🔄 OCR untuk invoice/dokumen (future)
- 🔄 Image recognition (future)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL 15+
- AWS Account (untuk S3)

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/circularfund.git
cd circularfund
```

### 2. Setup Database
```bash
# Create database
createdb circularfund

# Run schema
psql -d circularfund -f database/schema.sql

# (Optional) Seed data
psql -d circularfund -f database/seed-data.sql
```

### 3. Setup Backend (NestJS)
```bash
cd backend
npm install
cp .env.example .env
# Edit .env dengan database credentials
npm run start:dev
```

### 4. Setup AI Service (Python)
```bash
cd ai-service
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
cp .env.example .env
python main.py
```

### 5. Setup Frontend (Next.js)
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

### 6. Access Application
- 🌐 Frontend: http://localhost:3000
- 🔧 Backend API: http://localhost:4000
- 🤖 AI Service: http://localhost:5000
- 📚 API Docs: http://localhost:4000/api

### Windows: Start All Services
```bash
# Run from root directory
start-services.bat
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router, React Server Components)
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Auth**: NextAuth.js

### Backend
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL 15 + TypeORM
- **Auth**: Passport JWT
- **Validation**: class-validator
- **Storage**: AWS S3 + CloudFront
- **Docs**: Swagger/OpenAPI

### AI Service
- **Framework**: FastAPI (Python)
- **ML**: scikit-learn, pandas
- **LLM**: OpenAI GPT-4 / Anthropic Claude
- **OCR**: pytesseract (future)
- **Image**: Pillow, OpenCV (future)

### Infrastructure
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway / Render
- **Database**: Supabase / Railway PostgreSQL
- **Storage**: AWS S3 + CloudFront
- **Monitoring**: Sentry
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
circularfund/
├── frontend/              # Next.js frontend
│   ├── app/              # App router pages
│   ├── components/       # React components
│   ├── lib/              # Utilities & API client
│   └── public/           # Static assets
├── backend/              # NestJS backend
│   ├── src/
│   │   ├── auth/        # Authentication
│   │   ├── umkm/        # UMKM features
│   │   ├── investor/    # Investor features
│   │   ├── scoring/     # Scoring logic
│   │   └── file/        # File upload
│   └── test/            # Tests
├── ai-service/           # Python AI service
│   ├── main.py          # FastAPI app
│   ├── models/          # ML models
│   └── utils/           # Helper functions
├── database/             # Database files
│   ├── schema.sql       # Database schema
│   └── seed-data.sql    # Sample data
├── docs/                 # Documentation
│   ├── product-requirements.md      # 📋 Fitur lengkap & user flows
│   ├── technical-specification.md   # 🏗️ Database, API, tech stack
│   ├── implementation-guide.md      # 🛠️ Step-by-step development
│   ├── ai-prompts.md               # 🤖 AI assistant prompts
│   ├── architecture.md             # 🎨 System architecture
│   └── scoring-logic.md            # 🧮 Algoritma scoring
├── PROJECT-CHECKLIST.md  # ✅ Development checklist
├── start-services.bat    # 🚀 Start all services (Windows)
└── README.md
```

## 📖 Documentation

Dokumentasi lengkap untuk membangun aplikasi CircularFund dari awal sampai deployment:

### 📋 Product & Business
- **[Product Requirements](docs/product-requirements.md)** - Fitur lengkap, user personas, user flows, success metrics, monetization strategy
  - Problem statement & solution
  - User personas (UMKM & Investor)
  - Core features detail
  - MVP scope & roadmap
  - Timeline estimate (8 minggu)

### 🏗️ Technical Documentation
- **[Technical Specification](docs/technical-specification.md)** - Database schema detail, API endpoints, tech stack, deployment
  - Complete database schema dengan indexes
  - All API endpoints dengan request/response
  - Frontend structure & components
  - Environment variables
  - Security checklist
  
- **[Architecture](docs/architecture.md)** - System architecture overview, data flow, security
  - 3-tier architecture diagram
  - Core components
  - Data flow untuk scoring process
  
- **[Scoring Logic](docs/scoring-logic.md)** - Detail algoritma scoring AI
  - 8 indikator dengan scoring rules
  - AI validation process
  - Recommendation tags
  - Baseline calculation

### 🛠️ Development Guides
- **[Implementation Guide](docs/implementation-guide.md)** - Step-by-step development guide
  - Phase 1: Project setup (Week 1)
  - Phase 2: Authentication (Week 1-2)
  - Phase 3: UMKM features (Week 2-4)
  - Phase 4: Investor features (Week 5-6)
  - Phase 5: Testing & deployment (Week 7-8)
  - Troubleshooting tips

- **[AI Prompts](docs/ai-prompts.md)** - Kumpulan prompts untuk AI assistant
  - Generate components
  - Generate API endpoints
  - Generate tests
  - Generate documentation
  - 10+ ready-to-use prompts

### ✅ Project Management
- **[Project Checklist](PROJECT-CHECKLIST.md)** - Complete development checklist
  - Setup & configuration
  - Feature implementation tracking
  - Testing checklist
  - Deployment checklist
  - Progress tracking (currently 25%)

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register          # Register user
POST   /api/auth/login             # Login
POST   /api/auth/logout            # Logout
GET    /api/auth/me                # Get current user
```

### UMKM
```
GET    /api/umkm/profile           # Get profile
POST   /api/umkm/profile           # Create profile
POST   /api/umkm/submissions       # Submit circular practices
GET    /api/umkm/dashboard         # Dashboard stats
GET    /api/umkm/score-history     # Score history
```

### Investor
```
GET    /api/investor/umkm          # Browse UMKMs (with filters)
GET    /api/investor/umkm/:id      # UMKM detail
POST   /api/investor/bookmarks     # Bookmark UMKM
GET    /api/investor/dashboard     # Dashboard
```

### Scoring
```
POST   /api/scoring/calculate      # Calculate score
GET    /api/scoring/submission/:id # Get score result
```

### AI Service
```
POST   /validate                   # Validate submission
POST   /analyze-evidence           # Analyze evidence files
POST   /estimate-carbon            # Carbon calculation
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test              # Unit tests
npm run test:e2e          # E2E tests
npm run test:cov          # Coverage

# Frontend tests
cd frontend
npm run test

# AI service tests
cd ai-service
pytest
pytest --cov             # With coverage
```

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Railway)
1. Push to GitHub
2. Connect repository to Railway
3. Add environment variables
4. Deploy automatically

### AI Service (Railway)
1. Push to GitHub
2. Connect repository to Railway
3. Add environment variables
4. Deploy automatically

### Database (Supabase)
1. Create project on Supabase
2. Run migrations from `database/schema.sql`
3. Copy connection string to backend `.env`

## 🔐 Environment Variables

### Backend
```bash
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
AI_SERVICE_URL=http://localhost:5000
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=circularfund-evidence
```

### Frontend
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXTAUTH_SECRET=your-secret
```

### AI Service
```bash
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

## 📈 Roadmap

### Phase 1 (MVP) - 8 weeks ✅
- [x] User authentication (UMKM & Investor)
- [x] UMKM profile & submission
- [x] AI scoring system
- [x] Investor discovery & filtering
- [x] Evidence upload
- [x] Dashboard

### Phase 2 - 4 weeks
- [ ] Email notifications
- [ ] Advanced AI (OCR, image recognition)
- [ ] In-app messaging
- [ ] Payment integration
- [ ] Mobile responsive optimization

### Phase 3 - 6 weeks
- [ ] Investment tracking
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced reporting

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

MIT License - see [LICENSE](LICENSE) file

## 👥 Team

- Product Manager: [Your Name]
- Tech Lead: [Your Name]
- Frontend Developer: [Your Name]
- Backend Developer: [Your Name]
- AI Engineer: [Your Name]

## 📞 Contact

- Email: hello@circularfund.id
- Website: https://circularfund.id
- Twitter: @circularfund

---

**Built with ❤️ for sustainable future**

A digital funding platform that increases financing probability for MSMEs demonstrating circular economy practices through AI-assisted scoring.

## Core Concept

CircularFund provides a **Circular Readiness Score (CRS)** to help investors make informed decisions. The system does NOT auto-approve/reject funding — it's a decision support tool.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: NestJS (Node.js)
- **Database**: PostgreSQL
- **File Storage**: S3-compatible storage
- **AI Layer**: Rule-based + LLM-assisted scoring
- **Auth**: JWT-based authentication

## Project Structure

```
circularfund/
├── frontend/          # Next.js application
├── backend/           # NestJS API
├── database/          # Schema & migrations
└── docs/              # Architecture & design docs
```

## Quick Start

See individual README files in `frontend/` and `backend/` directories.

## Key Features

- **UMKM Dashboard**: Submit circular practices, upload evidence, track scores
- **Investor Dashboard**: Browse MSMEs, filter by CRS, view detailed profiles
- **AI Scoring**: Automated CRS calculation with human verification
- **Progress Tracking**: Historical score evolution

## Scoring System

**Circular Readiness Score (0-100)**
- Operational Circularity: 60%
- Ethics & Governance: 15%
- Impact Proxy: 25%

Minimum eligibility: 40 points
