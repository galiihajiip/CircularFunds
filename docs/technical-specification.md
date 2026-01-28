# CircularFund - Technical Specification

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│                    Next.js 14 (Vercel)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  UMKM Pages  │  │Investor Pages│  │  Shared UI   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API (HTTPS)
┌────────────────────────▼────────────────────────────────────┐
│                    BACKEND API GATEWAY                       │
│                  NestJS (Railway/Render)                     │
│  ┌──────┐ ┌──────┐ ┌────────┐ ┌────────┐ ┌──────┐         │
│  │ Auth │ │ UMKM │ │Investor│ │Scoring │ │ File │         │
│  └───┬──┘ └───┬──┘ └───┬────┘ └───┬────┘ └───┬──┘         │
└──────┼────────┼────────┼──────────┼──────────┼─────────────┘
       │        │        │          │          │
       │        │        │          │          │
       │        └────────┼──────────┼──────────┼─────────┐
       │                 │          │          │         │
       │                 │          │          │         │
┌──────▼─────────────────▼──────────▼──────────┼─────────┼───┐
│                  PostgreSQL 15                │         │   │
│              (Supabase/Railway)               │         │   │
└───────────────────────────────────────────────┘         │   │
                                                          │   │
┌─────────────────────────────────────────────────────────▼───┤
│                    AI SERVICE                               │
│                 FastAPI (Railway)                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │Validation│ │  Anomaly │ │   OCR    │ │   LLM    │     │
│  │  Engine  │ │ Detection│ │  Engine  │ │Integration│     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
└─────────────────────────────────────────────────────────────┘
                                                          │
┌─────────────────────────────────────────────────────────▼───┐
│                      AWS S3 + CloudFront                    │
│              Evidence Files & Profile Images                │
└─────────────────────────────────────────────────────────────┘
```

## 2. Database Schema (Detailed)

### 2.1 Users & Authentication

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('UMKM', 'INVESTOR')),
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_verification_token ON users(verification_token);
```

### 2.2 UMKM Profiles

```sql
CREATE TABLE umkm_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    sector VARCHAR(100) NOT NULL,
    description TEXT,
    province VARCHAR(100),
    city VARCHAR(100),
    address TEXT,
    established_year INTEGER,
    employee_count INTEGER,
    phone VARCHAR(50),
    whatsapp VARCHAR(50),
    website VARCHAR(255),
    instagram VARCHAR(100),
    
    -- Profile images
    logo_url TEXT,
    cover_image_url TEXT,
    product_images JSONB, -- Array of image URLs
    
    -- Stats
    profile_views INTEGER DEFAULT 0,
    bookmark_count INTEGER DEFAULT 0,
    current_score INTEGER,
    
    -- Status
    is_published BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_umkm_user ON umkm_profiles(user_id);
CREATE INDEX idx_umkm_sector ON umkm_profiles(sector);
CREATE INDEX idx_umkm_province ON umkm_profiles(province);
CREATE INDEX idx_umkm_score ON umkm_profiles(current_score);
CREATE INDEX idx_umkm_published ON umkm_profiles(is_published);
```

### 2.3 Investor Profiles

```sql
CREATE TABLE investor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    organization VARCHAR(255),
    investor_type VARCHAR(50) CHECK (investor_type IN ('INDIVIDUAL', 'VC', 'CORPORATE', 'NGO')),
    
    -- Investment preferences
    focus_sectors JSONB, -- Array of sectors
    preferred_provinces JSONB, -- Array of provinces
    min_investment_amount DECIMAL(15,2),
    max_investment_amount DECIMAL(15,2),
    
    -- Profile
    bio TEXT,
    profile_image_url TEXT,
    phone VARCHAR(50),
    linkedin VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_investor_user ON investor_profiles(user_id);
CREATE INDEX idx_investor_type ON investor_profiles(investor_type);
```

### 2.4 Submissions

```sql
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    umkm_id UUID REFERENCES umkm_profiles(id) ON DELETE CASCADE,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'SCORED', 'FLAGGED', 'REJECTED')),
    
    -- Operational Circularity (60 points)
    -- 1. Resource Reduction (15 points)
    resource_reduction_percentage DECIMAL(5,2),
    resource_reduction_details TEXT,
    resource_baseline_data TEXT,
    
    -- 2. Reuse Practice (15 points)
    reuse_frequency VARCHAR(50) CHECK (reuse_frequency IN ('none', 'occasional', 'regular', 'systematic')),
    reuse_details TEXT,
    reuse_examples TEXT,
    
    -- 3. Recycle Integration (10 points)
    recycle_type VARCHAR(50) CHECK (recycle_type IN ('none', 'partner', 'internal')),
    recycle_details TEXT,
    recycle_partner_name VARCHAR(255),
    
    -- 4. Product Durability (10 points)
    product_lifespan_years DECIMAL(4,1),
    product_repairability BOOLEAN,
    product_details TEXT,
    warranty_info TEXT,
    
    -- 5. Process Efficiency (10 points)
    process_efficiency_improvement DECIMAL(5,2),
    process_details TEXT,
    process_baseline TEXT,
    
    -- Ethics & Governance (15 points)
    -- 6. Transparency & Traceability (15 points)
    documentation_level VARCHAR(50) CHECK (documentation_level IN ('minimal', 'basic', 'comprehensive', 'full')),
    traceability_system BOOLEAN,
    documentation_details TEXT,
    
    -- Impact Proxy (25 points)
    -- 7. Carbon Avoidance (15 points)
    carbon_reduction_kg DECIMAL(10,2),
    carbon_calculation_method VARCHAR(100) CHECK (carbon_calculation_method IN ('waste_diverted', 'energy_saved', 'transport_reduced', 'other')),
    carbon_calculation_details TEXT,
    
    -- 8. Livelihood Impact (10 points)
    local_employees INTEGER,
    income_stability VARCHAR(50) CHECK (income_stability IN ('unstable', 'moderate', 'stable')),
    employee_details TEXT,
    
    -- Baseline tracking
    is_baseline BOOLEAN DEFAULT FALSE,
    baseline_submission_id UUID REFERENCES submissions(id),
    
    -- Processing metadata
    processing_started_at TIMESTAMP,
    processing_completed_at TIMESTAMP,
    processing_duration_seconds INTEGER,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_submissions_umkm ON submissions(umkm_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_date ON submissions(submission_date DESC);
```

### 2.5 Evidence Files

```sql
CREATE TABLE evidence_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
    
    -- File info
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INTEGER NOT NULL,
    file_url TEXT NOT NULL,
    thumbnail_url TEXT,
    
    -- Categorization
    indicator_category VARCHAR(100) NOT NULL,
    -- Categories: resource_reduction, reuse_practice, recycle_integration, 
    --            product_durability, process_efficiency, transparency, 
    --            carbon_avoidance, livelihood_impact
    
    -- AI Analysis (future)
    ocr_text TEXT,
    ai_analysis JSONB,
    is_validated BOOLEAN DEFAULT FALSE,
    
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_evidence_submission ON evidence_files(submission_id);
CREATE INDEX idx_evidence_category ON evidence_files(indicator_category);
```

### 2.6 Scores

```sql
CREATE TABLE scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
    umkm_id UUID REFERENCES umkm_profiles(id) ON DELETE CASCADE,
    
    -- Total score (0-100)
    total_score INTEGER NOT NULL CHECK (total_score >= 0 AND total_score <= 100),
    
    -- Category scores
    operational_circularity_score DECIMAL(5,2) CHECK (operational_circularity_score >= 0 AND operational_circularity_score <= 60),
    ethics_score DECIMAL(5,2) CHECK (ethics_score >= 0 AND ethics_score <= 15),
    impact_score DECIMAL(5,2) CHECK (impact_score >= 0 AND impact_score <= 25),
    
    -- Indicator breakdown (with confidence)
    resource_reduction_score DECIMAL(5,2),
    resource_reduction_confidence DECIMAL(3,2),
    
    reuse_practice_score DECIMAL(5,2),
    reuse_practice_confidence DECIMAL(3,2),
    
    recycle_integration_score DECIMAL(5,2),
    recycle_integration_confidence DECIMAL(3,2),
    
    product_durability_score DECIMAL(5,2),
    product_durability_confidence DECIMAL(3,2),
    
    process_efficiency_score DECIMAL(5,2),
    process_efficiency_confidence DECIMAL(3,2),
    
    transparency_score DECIMAL(5,2),
    transparency_confidence DECIMAL(3,2),
    
    carbon_avoidance_score DECIMAL(5,2),
    carbon_avoidance_confidence DECIMAL(3,2),
    
    livelihood_impact_score DECIMAL(5,2),
    livelihood_impact_confidence DECIMAL(3,2),
    
    -- AI metadata
    ai_overall_confidence DECIMAL(3,2),
    ai_flags JSONB, -- Array of flag messages
    ai_suggestions JSONB, -- Array of improvement suggestions
    ai_model_version VARCHAR(50),
    
    -- Recommendation
    recommendation VARCHAR(50) CHECK (recommendation IN ('Low Readiness', 'Developing', 'Ready', 'High Circular Potential')),
    
    -- Comparison with previous
    previous_score_id UUID REFERENCES scores(id),
    score_change INTEGER, -- Difference from previous
    
    scored_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_scores_umkm ON scores(umkm_id);
CREATE INDEX idx_scores_total ON scores(total_score DESC);
CREATE INDEX idx_scores_recommendation ON scores(recommendation);
CREATE INDEX idx_scores_date ON scores(scored_at DESC);
```

### 2.7 Bookmarks

```sql
CREATE TABLE bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investor_id UUID REFERENCES investor_profiles(id) ON DELETE CASCADE,
    umkm_id UUID REFERENCES umkm_profiles(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(investor_id, umkm_id)
);

CREATE INDEX idx_bookmarks_investor ON bookmarks(investor_id);
CREATE INDEX idx_bookmarks_umkm ON bookmarks(umkm_id);
```

### 2.8 Profile Views (Analytics)

```sql
CREATE TABLE profile_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    umkm_id UUID REFERENCES umkm_profiles(id) ON DELETE CASCADE,
    investor_id UUID REFERENCES investor_profiles(id) ON DELETE SET NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_id VARCHAR(255),
    user_agent TEXT,
    ip_address INET
);

CREATE INDEX idx_views_umkm ON profile_views(umkm_id);
CREATE INDEX idx_views_investor ON profile_views(investor_id);
CREATE INDEX idx_views_date ON profile_views(viewed_at DESC);
```

## 3. API Endpoints

### 3.1 Authentication (`/api/auth`)

```typescript
POST   /api/auth/register          // Register new user
POST   /api/auth/login             // Login
POST   /api/auth/logout            // Logout
POST   /api/auth/refresh           // Refresh JWT token
POST   /api/auth/verify-email      // Verify email with token
POST   /api/auth/forgot-password   // Request password reset
POST   /api/auth/reset-password    // Reset password with token
GET    /api/auth/me                // Get current user info
```

### 3.2 UMKM (`/api/umkm`)

```typescript
// Profile management
GET    /api/umkm/profile           // Get own profile
POST   /api/umkm/profile           // Create profile
PUT    /api/umkm/profile           // Update profile
DELETE /api/umkm/profile           // Delete profile
POST   /api/umkm/profile/images    // Upload profile images

// Submissions
GET    /api/umkm/submissions       // List own submissions
GET    /api/umkm/submissions/:id   // Get submission detail
POST   /api/umkm/submissions       // Create new submission
PUT    /api/umkm/submissions/:id   // Update submission (if pending)
DELETE /api/umkm/submissions/:id   // Delete submission

// Evidence
POST   /api/umkm/submissions/:id/evidence  // Upload evidence files
DELETE /api/umkm/evidence/:id              // Delete evidence file

// Dashboard
GET    /api/umkm/dashboard         // Dashboard stats & current score
GET    /api/umkm/score-history     // Score progression over time
```

### 3.3 Investor (`/api/investor`)

```typescript
// Profile management
GET    /api/investor/profile       // Get own profile
POST   /api/investor/profile       // Create profile
PUT    /api/investor/profile       // Update profile

// Discovery
GET    /api/investor/umkm          // List UMKMs with filters
GET    /api/investor/umkm/:id      // Get UMKM detail
POST   /api/investor/umkm/:id/view // Track profile view

// Bookmarks
GET    /api/investor/bookmarks     // List bookmarked UMKMs
POST   /api/investor/bookmarks     // Add bookmark
DELETE /api/investor/bookmarks/:id // Remove bookmark
PUT    /api/investor/bookmarks/:id // Update bookmark notes

// Dashboard
GET    /api/investor/dashboard     // Dashboard stats
GET    /api/investor/recommendations // AI-recommended UMKMs
```

### 3.4 Scoring (`/api/scoring`)

```typescript
POST   /api/scoring/calculate      // Calculate score for submission
GET    /api/scoring/submission/:id // Get score for submission
GET    /api/scoring/umkm/:id       // Get latest score for UMKM
GET    /api/scoring/history/:umkmId // Get score history
```

### 3.5 Files (`/api/files`)

```typescript
POST   /api/files/upload           // Upload file to S3
GET    /api/files/:id              // Get file metadata
DELETE /api/files/:id              // Delete file
GET    /api/files/presigned-url    // Get presigned URL for direct upload
```

### 3.6 Public (`/api/public`)

```typescript
GET    /api/public/sectors         // List available sectors
GET    /api/public/provinces       // List provinces
GET    /api/public/stats           // Platform statistics
```

## 4. Frontend Structure

```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   ├── verify-email/
│   │   └── reset-password/
│   ├── (umkm)/
│   │   ├── dashboard/
│   │   ├── profile/
│   │   │   ├── edit/
│   │   │   └── preview/
│   │   ├── submissions/
│   │   │   ├── new/
│   │   │   ├── [id]/
│   │   │   └── history/
│   │   └── score/
│   ├── (investor)/
│   │   ├── dashboard/
│   │   ├── discover/
│   │   ├── umkm/
│   │   │   └── [id]/
│   │   ├── bookmarks/
│   │   └── profile/
│   ├── api/           // API routes (if needed)
│   ├── layout.tsx
│   └── page.tsx       // Landing page
├── components/
│   ├── ui/            // shadcn/ui components
│   ├── forms/         // Form components
│   ├── charts/        // Chart components
│   ├── layouts/       // Layout components
│   └── shared/        // Shared components
├── lib/
│   ├── api.ts         // API client
│   ├── auth.ts        // Auth utilities
│   ├── utils.ts       // Helper functions
│   └── constants.ts   // Constants
├── hooks/             // Custom React hooks
├── store/             // Zustand stores
├── types/             // TypeScript types
└── public/            // Static assets
```

## 5. Component Library (shadcn/ui)

### Core Components:
- Button, Input, Textarea, Select, Checkbox, Radio
- Card, Badge, Avatar, Separator
- Dialog, Sheet, Popover, Tooltip
- Table, Tabs, Accordion
- Form (with React Hook Form integration)
- Toast (notifications)
- Progress, Skeleton (loading states)
- DropdownMenu, NavigationMenu

### Custom Components:
- `ScoreGauge` - Circular score display
- `ScoreBreakdown` - Bar chart for categories
- `EvidenceGallery` - Image gallery with lightbox
- `UMKMCard` - UMKM preview card
- `FilterPanel` - Advanced filters
- `FileUploader` - Drag & drop upload
- `SubmissionWizard` - Multi-step form

## 6. AI Service Endpoints

### 6.1 Python FastAPI (`http://localhost:5000`)

```python
POST   /validate                   # Validate submission data
POST   /analyze-evidence           # OCR & image analysis
POST   /estimate-carbon            # Carbon calculation
POST   /detect-anomalies           # Anomaly detection
POST   /generate-suggestions       # AI suggestions
GET    /health                     # Health check
```

### 6.2 AI Models & Logic

**Anomaly Detection:**
```python
def detect_anomalies(submission_data):
    anomalies = []
    
    # Rule 1: High claims without evidence
    if submission_data.carbon_reduction_kg > 5000:
        if len(submission_data.evidence_files) < 5:
            anomalies.append({
                "type": "insufficient_evidence",
                "severity": "high",
                "message": "Klaim pengurangan karbon tinggi memerlukan lebih banyak bukti"
            })
    
    # Rule 2: Inconsistent data
    if submission_data.resource_reduction_percentage > 50:
        if submission_data.documentation_level == "minimal":
            anomalies.append({
                "type": "inconsistent_data",
                "severity": "medium",
                "message": "Pengurangan resource tinggi tidak konsisten dengan dokumentasi minimal"
            })
    
    # Rule 3: Unrealistic efficiency
    if submission_data.process_efficiency_improvement > 100:
        anomalies.append({
            "type": "unrealistic_claim",
            "severity": "high",
            "message": "Peningkatan efisiensi >100% tidak realistis"
        })
    
    return anomalies
```

**Confidence Scoring:**
```python
def calculate_confidence(indicator_data, evidence_count):
    base_confidence = 0.5
    
    # Evidence quality boost
    if evidence_count >= 3:
        base_confidence += 0.2
    elif evidence_count >= 1:
        base_confidence += 0.1
    
    # Data completeness boost
    if indicator_data.details and len(indicator_data.details) > 50:
        base_confidence += 0.15
    
    # Baseline comparison boost
    if indicator_data.baseline_data:
        base_confidence += 0.15
    
    return min(base_confidence, 1.0)
```

## 7. Environment Variables

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### Backend (.env)
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/circularfund
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=circularfund

# Application
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# AI Service
AI_SERVICE_URL=http://localhost:5000

# AWS S3
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=circularfund-evidence
AWS_CLOUDFRONT_URL=https://d123456.cloudfront.net

# Email (SendGrid/Mailgun)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=noreply@circularfund.id

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

### AI Service (.env)
```bash
PORT=5000
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
MODEL_VERSION=1.0.0
LOG_LEVEL=INFO
```

## 8. Deployment

### 8.1 Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod

# Environment variables set in Vercel dashboard
```

### 8.2 Backend (Railway)
```yaml
# railway.json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 8.3 AI Service (Railway)
```yaml
# railway.json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pip install -r requirements.txt"
  },
  "deploy": {
    "startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### 8.4 Database (Supabase)
- Create project on Supabase
- Run migrations from `database/schema.sql`
- Enable Row Level Security (RLS)
- Setup connection pooling

## 9. Testing Strategy

### Unit Tests
- Backend: Jest + Supertest
- Frontend: Jest + React Testing Library
- AI Service: pytest

### Integration Tests
- API endpoint testing
- Database transactions
- File upload flows

### E2E Tests
- Playwright for critical user flows
- UMKM submission flow
- Investor discovery flow

### Performance Tests
- Load testing with k6
- Database query optimization
- API response time monitoring

## 10. Security Checklist

✅ HTTPS everywhere
✅ JWT with short expiration + refresh tokens
✅ Password hashing with bcrypt (10 rounds)
✅ SQL injection prevention (ORM parameterized queries)
✅ XSS protection (React auto-escaping + CSP headers)
✅ CSRF protection (SameSite cookies)
✅ Rate limiting (10 req/min for auth, 100 req/min for API)
✅ File upload validation (type, size, virus scan)
✅ Input validation (class-validator, Zod)
✅ Secure headers (Helmet.js)
✅ Environment variables (never commit .env)
✅ Dependency scanning (npm audit, Snyk)

---

**Document Version**: 1.0
**Last Updated**: January 2026
**Owner**: Engineering Team
