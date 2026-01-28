# CircularFund - Product Requirements Document (PRD)

## 1. Executive Summary

**CircularFund** adalah platform digital yang menghubungkan UMKM yang menerapkan praktik ekonomi sirkular dengan investor yang ingin mendanai bisnis berkelanjutan. Platform menggunakan AI untuk menilai tingkat kesiapan sirkular UMKM dan memberikan skor kredibilitas untuk membantu investor membuat keputusan pendanaan.

## 2. Problem Statement

### Masalah UMKM:
- Sulit mendapat akses pendanaan karena kurangnya track record
- Tidak ada standar untuk mengukur praktik ekonomi sirkular
- Kesulitan membuktikan dampak lingkungan mereka

### Masalah Investor:
- Sulit menemukan UMKM yang benar-benar menerapkan ekonomi sirkular
- Tidak ada metrik objektif untuk menilai kredibilitas klaim
- Risiko greenwashing tinggi

## 3. Solution Overview

Platform 2-sided marketplace dengan AI scoring system yang:
- **Untuk UMKM**: Submit praktik sirkular → Dapat skor → Visible ke investor
- **Untuk Investor**: Browse UMKM → Filter by score → Lihat detail & evidence → Kontak untuk pendanaan

## 4. User Personas

### Persona 1: UMKM Owner (Ibu Siti - Pengrajin Tas Daur Ulang)
- **Usia**: 35-50 tahun
- **Tech Savvy**: Medium (bisa pakai smartphone, WhatsApp)
- **Goals**: Dapat modal untuk ekspansi, diakui praktik sirkularnya
- **Pain Points**: Tidak tahu cara mengukur dampak, sulit dokumentasi

### Persona 2: Impact Investor (Bapak Andi - Fund Manager)
- **Usia**: 30-45 tahun
- **Tech Savvy**: High
- **Goals**: Investasi dengan impact terukur, portfolio diversifikasi
- **Pain Points**: Sulit verifikasi klaim, butuh due diligence cepat

## 5. Core Features

### 5.1 UMKM Side

#### A. Registration & Profile
- Email/password authentication
- Business profile:
  - Nama usaha
  - Sektor (Fashion, F&B, Kerajinan, Pertanian, dll)
  - Lokasi (Provinsi, Kota)
  - Tahun berdiri
  - Jumlah karyawan
  - Deskripsi bisnis
  - Foto produk (max 5)
  - Kontak (WhatsApp, Email)

#### B. Circular Practice Submission
Form wizard dengan 3 kategori:

**Kategori 1: Operational Circularity (60 poin)**

1. **Resource Reduction** (15 poin)
   - Input: % pengurangan bahan baku/energi vs baseline
   - Evidence: Foto invoice/struk pembelian (before/after)
   - Contoh: "Dulu beli 100kg kain/bulan, sekarang 70kg"

2. **Reuse Practice** (15 poin)
   - Input: Frekuensi reuse (Tidak ada, Kadang <25%, Rutin 25-50%, Sistematis >50%)
   - Evidence: Foto proses reuse, video produksi
   - Contoh: "Sisa kain dijahit jadi aksesori"

3. **Recycle Integration** (10 poin)
   - Input: Tipe (Tidak ada, Partner eksternal, Internal)
   - Evidence: Foto kerjasama/sertifikat, proses daur ulang
   - Contoh: "Kerjasama dengan bank sampah"

4. **Product Durability** (10 poin)
   - Input: Umur produk (tahun), Bisa diperbaiki? (Ya/Tidak)
   - Evidence: Foto produk, garansi, testimoni customer
   - Contoh: "Tas tahan 3 tahun, bisa dijahit ulang"

5. **Process Efficiency** (10 poin)
   - Input: % peningkatan efisiensi output/input
   - Evidence: Foto proses, data produksi
   - Contoh: "Dari 1kg bahan jadi 10 produk, sekarang 15 produk"

**Kategori 2: Ethics & Governance** (15 poin)

6. **Transparency & Traceability** (15 poin)
   - Input: Level dokumentasi (Minimal, Basic, Comprehensive, Full)
   - Evidence: Invoice, catatan produksi, sertifikat
   - Contoh: "Punya buku kas, foto setiap batch produksi"

**Kategori 3: Impact Proxy** (25 poin)

7. **Carbon Avoidance** (15 poin)
   - Input: Estimasi CO2 yang dihindari (kg/tahun)
   - Metode kalkulasi: Dropdown (Waste diverted, Energy saved, Transport reduced)
   - Evidence: Foto timbangan sampah, meteran listrik
   - Contoh: "Daur ulang 500kg plastik = ~1000kg CO2 avoided"

8. **Livelihood Impact** (10 poin)
   - Input: Jumlah karyawan lokal, Stabilitas income (Tidak stabil, Cukup stabil, Stabil)
   - Evidence: Foto tim, slip gaji (blur nominal)
   - Contoh: "7 karyawan tetap, gaji bulanan"

#### C. Evidence Upload
- Max 10 files per submission
- Format: JPG, PNG, PDF (max 5MB each)
- Auto-compress images
- Preview before submit

#### D. Dashboard UMKM
- **Current Score**: Display besar dengan badge (Low/Developing/Ready/High Potential)
- **Score Breakdown**: Chart pie (Operational/Ethics/Impact)
- **Score History**: Line chart progress over time
- **Recommendations**: AI suggestions untuk improve score
- **Profile Views**: Berapa investor lihat profile
- **Submission Status**: Pending/Scored/Flagged

### 5.2 Investor Side

#### A. Registration & Profile
- Email/password authentication
- Investor profile:
  - Nama lengkap
  - Organisasi/Perusahaan
  - Tipe investor (Individual, VC, Corporate, NGO)
  - Focus area (Sektor yang diminati)
  - Investment range (min-max)

#### B. UMKM Discovery
**Filter & Search:**
- Sektor (multi-select)
- Lokasi (provinsi)
- Score range (slider 0-100)
- Recommendation tag (Ready, High Potential)
- Jumlah karyawan
- Sort by: Score (high-low), Newest, Most viewed

**UMKM Card Display:**
```
┌─────────────────────────────┐
│ [Foto Produk]               │
│                             │
│ Nama UMKM                   │
│ Sektor • Lokasi             │
│                             │
│ ⭐ Score: 72/100            │
│ 🏷️ Ready                    │
│                             │
│ 👥 5 employees              │
│ 🌱 500kg CO2 avoided/year   │
│                             │
│ [Lihat Detail]              │
└─────────────────────────────┘
```

#### C. UMKM Detail Page
**Section 1: Overview**
- Business description
- Product photos gallery
- Contact info (WhatsApp button, Email)

**Section 2: Circular Score**
- Total score dengan visual gauge
- Breakdown per kategori (bar chart)
- Breakdown per indikator (table dengan confidence level)
- AI flags (jika ada)
- Recommendation tag

**Section 3: Evidence**
- Gallery semua evidence files
- Grouped by indicator
- Lightbox view untuk zoom

**Section 4: Impact Metrics**
- CO2 avoided (kg/year)
- Waste diverted (kg/year)
- Local jobs created
- Resource efficiency improvement

**Section 5: Submission History**
- Timeline submissions
- Score progression chart
- Show improvement over time

#### D. Dashboard Investor
- **Saved UMKMs**: Bookmark favorites
- **Recently Viewed**: History browsing
- **Recommended**: AI-matched based on preferences
- **Statistics**: Total UMKMs by sector, avg score, etc.

## 6. AI Scoring System

### 6.1 Scoring Logic

**Total Score: 0-100 points**

| Kategori | Max Points | Weight |
|----------|-----------|--------|
| Operational Circularity | 60 | 60% |
| Ethics & Governance | 15 | 15% |
| Impact Proxy | 25 | 25% |

**Recommendation Tags:**
- **Low Readiness** (0-39): Belum eligible, perlu improvement
- **Developing** (40-59): Eligible, masih berkembang
- **Ready** (60-79): Praktik sirkular baik, siap didanai
- **High Circular Potential** (80-100): Excellent, prioritas tinggi

### 6.2 AI Validation Features

**Anomaly Detection:**
- Klaim terlalu tinggi tanpa evidence cukup
- Inconsistency antar indikator
- Foto evidence tidak relevan (future: image recognition)

**Confidence Scoring:**
- Setiap indikator punya confidence level (0-1)
- Berdasarkan: kelengkapan data, kualitas evidence, konsistensi

**Smart Suggestions:**
- "Tambahkan invoice untuk meningkatkan confidence"
- "Score transparency rendah, upload lebih banyak dokumentasi"
- "Klaim carbon reduction tinggi, jelaskan metode kalkulasi"

### 6.3 Evidence Analysis (Future Enhancement)
- OCR untuk extract data dari invoice/struk
- Image recognition untuk validasi foto produk/proses
- NLP untuk analyze deskripsi text

## 7. Tech Stack

### 7.1 Frontend
**Framework**: Next.js 14 (App Router)
- **Why**: SSR untuk SEO, React Server Components, fast
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand (lightweight)
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Image Upload**: react-dropzone + image compression
- **HTTP Client**: Axios
- **Auth**: NextAuth.js

**UI/UX Design System:**
- **Colors**: 
  - Primary: Green (#10B981) - sustainability
  - Secondary: Blue (#3B82F6) - trust
  - Accent: Orange (#F59E0B) - energy
- **Typography**: 
  - Headings: Inter (bold, modern)
  - Body: Inter (regular)
- **Components**: shadcn/ui (accessible, customizable)

### 7.2 Backend
**Framework**: NestJS (TypeScript)
- **Why**: Enterprise-grade, modular, TypeScript native
- **ORM**: TypeORM
- **Validation**: class-validator, class-transformer
- **Auth**: Passport JWT
- **File Upload**: Multer + AWS S3
- **API Docs**: Swagger/OpenAPI

**Modules:**
- `auth.module` - Authentication & authorization
- `umkm.module` - UMKM profile & submissions
- `investor.module` - Investor profile & browsing
- `scoring.module` - Score calculation & history
- `file.module` - Evidence upload & storage
- `notification.module` - Email notifications (future)

### 7.3 AI Service
**Framework**: FastAPI (Python)
- **Why**: Fast, async, perfect for ML/AI
- **ML Libraries**: 
  - scikit-learn (anomaly detection)
  - pandas (data processing)
  - pytesseract (OCR - future)
- **LLM Integration**: 
  - OpenAI API (GPT-4 for validation)
  - Anthropic Claude (alternative)
- **Image Processing**: Pillow, OpenCV (future)

### 7.4 Database
**Primary**: PostgreSQL 15
- **Why**: Robust, JSONB support, full-text search
- **Extensions**: pg_trgm (fuzzy search)

**Schema Design:**
- `users` - Both UMKM & Investor
- `umkm_profiles` - Business info
- `investor_profiles` - Investor info
- `submissions` - Circular practice data
- `evidence_files` - File metadata & URLs
- `scores` - Score results & history
- `bookmarks` - Investor saved UMKMs

### 7.5 Storage
**File Storage**: AWS S3
- **Buckets**: 
  - `circularfund-evidence` - Evidence files
  - `circularfund-profiles` - Profile photos
- **CDN**: CloudFront for fast delivery

### 7.6 Infrastructure
**Hosting**: 
- **Frontend**: Vercel (auto-deploy from Git)
- **Backend**: Railway / Render (containerized)
- **AI Service**: Railway / Render (Python container)
- **Database**: Supabase / Railway PostgreSQL

**CI/CD**: GitHub Actions
**Monitoring**: Sentry (error tracking)
**Analytics**: Google Analytics / Mixpanel

## 8. User Flows

### 8.1 UMKM Flow
```
1. Register → Email verification
2. Complete profile → Upload business info & photos
3. Submit circular practices → Fill form + upload evidence
4. AI processing → Get score in 1-2 minutes
5. View dashboard → See score, recommendations
6. Improve practices → Resubmit for higher score
7. Get contacted → Investor reach out via WhatsApp/Email
```

### 8.2 Investor Flow
```
1. Register → Email verification
2. Complete profile → Set investment preferences
3. Browse UMKMs → Filter by score, sector, location
4. View details → Check score breakdown, evidence
5. Bookmark favorites → Save interesting UMKMs
6. Contact UMKM → WhatsApp/Email for discussion
7. Track portfolio → Monitor invested UMKMs (future)
```

## 9. MVP Scope (Phase 1)

### Must Have:
✅ User registration & auth (UMKM & Investor)
✅ UMKM profile creation
✅ Circular practice submission (8 indicators)
✅ Evidence upload (images, PDF)
✅ AI scoring system (rule-based + basic validation)
✅ Score dashboard for UMKM
✅ UMKM discovery for Investor (filter, search)
✅ UMKM detail page with evidence
✅ Contact info display (WhatsApp, Email)

### Nice to Have (Phase 2):
- Email notifications
- Advanced AI (OCR, image recognition)
- Chat/messaging in-app
- Investment tracking
- Payment integration
- Mobile app (React Native)

## 10. Success Metrics

### UMKM Side:
- Number of registered UMKMs
- Submission completion rate
- Average score improvement over time
- Profile view rate

### Investor Side:
- Number of registered investors
- UMKM profile views
- Contact conversion rate (view → contact)
- Bookmark rate

### Platform:
- Monthly Active Users (MAU)
- Submission-to-funding conversion rate
- Average time to funding
- User satisfaction (NPS score)

## 11. Monetization Strategy (Future)

1. **Freemium Model**:
   - Free: 1 submission/month, basic score
   - Premium UMKM: Unlimited submissions, priority listing, advanced analytics
   
2. **Investor Subscription**:
   - Free: View up to 10 UMKMs/month
   - Pro: Unlimited access, advanced filters, direct messaging

3. **Success Fee**:
   - Small % dari funding yang berhasil (2-3%)

4. **Enterprise**:
   - White-label untuk corporate CSR programs

## 12. Timeline Estimate

**Week 1-2**: Setup & Database
- Project setup (Next.js, NestJS, FastAPI)
- Database schema & migrations
- Basic auth implementation

**Week 3-4**: UMKM Features
- Profile creation
- Submission form
- Evidence upload
- AI scoring integration

**Week 5-6**: Investor Features
- Discovery page
- Filtering & search
- Detail page
- Bookmark system

**Week 7-8**: Polish & Testing
- UI/UX refinement
- Testing (unit, integration, E2E)
- Bug fixes
- Deployment

**Total: 8 weeks for MVP**

## 13. Security & Privacy

- **Data Encryption**: HTTPS, encrypted at rest
- **Auth**: JWT with refresh tokens, bcrypt password hashing
- **File Validation**: Type checking, size limits, virus scan
- **Rate Limiting**: Prevent abuse
- **GDPR Compliance**: Data export, deletion rights
- **Privacy**: Evidence files only visible to verified investors

## 14. Accessibility

- **WCAG 2.1 AA** compliance
- Keyboard navigation
- Screen reader support
- High contrast mode
- Responsive design (mobile-first)

## 15. Localization

**Phase 1**: Bahasa Indonesia only
**Phase 2**: English support
- i18n setup with next-intl
- Currency: IDR (Rupiah)
- Date format: DD/MM/YYYY

---

**Document Version**: 1.0
**Last Updated**: January 2026
**Owner**: Product Team
