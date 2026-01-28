# AI Development Prompts - CircularFund

Kumpulan prompt untuk membantu development dengan AI assistant (ChatGPT, Claude, Copilot, dll).

---

## 1. Generate Frontend Component

```
Buatkan React component untuk CircularFund dengan spesifikasi:

Component: ScoreGauge
Purpose: Menampilkan circular readiness score dalam bentuk gauge/speedometer
Props:
- score: number (0-100)
- recommendation: string ('Low Readiness' | 'Developing' | 'Ready' | 'High Circular Potential')
- size: 'sm' | 'md' | 'lg'

Requirements:
- Gunakan Recharts untuk gauge visualization
- Color coding: Red (0-39), Yellow (40-59), Green (60-79), Blue (80-100)
- Animated transition
- Responsive design
- TypeScript
- Tailwind CSS styling
- Accessible (ARIA labels)

Tech stack: Next.js 14, TypeScript, Tailwind, Recharts
```

---

## 2. Generate Backend API Endpoint

```
Buatkan NestJS endpoint untuk CircularFund dengan spesifikasi:

Endpoint: GET /api/investor/umkm
Purpose: List UMKMs dengan filtering dan pagination untuk investor

Query Parameters:
- sector: string[] (optional) - Filter by sectors
- province: string[] (optional) - Filter by provinces
- minScore: number (optional) - Minimum score
- maxScore: number (optional) - Maximum score
- recommendation: string[] (optional) - Filter by recommendation tags
- page: number (default: 1)
- limit: number (default: 20)
- sortBy: 'score' | 'newest' | 'views' (default: 'score')
- sortOrder: 'asc' | 'desc' (default: 'desc')

Response:
{
  data: UmkmProfile[],
  meta: {
    total: number,
    page: number,
    limit: number,
    totalPages: number
  }
}

Requirements:
- TypeORM query builder
- Proper validation with class-validator
- Include current score and recommendation
- Only return published profiles
- Optimize query performance
- Add proper indexes
- Error handling
- Swagger documentation

Tech stack: NestJS, TypeORM, PostgreSQL, class-validator
```

---

## 3. Generate Database Migration

```
Buatkan PostgreSQL migration untuk CircularFund:

Purpose: Add notifications table untuk email/in-app notifications

Table: notifications
Columns:
- id: UUID primary key
- user_id: UUID foreign key to users
- type: VARCHAR (email, in_app, push)
- category: VARCHAR (submission_scored, investor_viewed, bookmark_added, message_received)
- title: VARCHAR(255)
- message: TEXT
- data: JSONB (additional data)
- is_read: BOOLEAN default false
- read_at: TIMESTAMP nullable
- created_at: TIMESTAMP default now

Requirements:
- Proper foreign key constraints
- Indexes for performance (user_id, is_read, created_at)
- Trigger for updated_at
- Sample data for testing

Format: SQL migration file
```

---

## 4. Generate AI Validation Logic

```
Buatkan Python function untuk CircularFund AI service:

Function: validate_carbon_claim
Purpose: Validasi klaim pengurangan karbon dengan anomaly detection

Input:
- carbon_reduction_kg: float
- calculation_method: str ('waste_diverted', 'energy_saved', 'transport_reduced')
- sector: str (Fashion, F&B, Kerajinan, dll)
- business_scale: str (small, medium, large)
- evidence_count: int
- details: str (explanation text)

Output:
{
  "is_valid": bool,
  "confidence": float (0-1),
  "flags": List[str],
  "suggestions": List[str],
  "adjusted_score": float (optional)
}

Logic:
1. Check if carbon reduction is realistic for sector & scale
2. Validate calculation method matches the claim
3. Check evidence sufficiency
4. Detect outliers using statistical methods
5. NLP analysis on details text (optional: use OpenAI)

Requirements:
- Use pandas for data analysis
- Statistical outlier detection (IQR method)
- Industry benchmarks for validation
- Clear flag messages in Bahasa Indonesia
- Actionable suggestions

Tech stack: Python, FastAPI, pandas, scikit-learn
```

---

## 5. Generate Test Cases

```
Buatkan unit tests untuk CircularFund:

File: scoring.service.spec.ts
Purpose: Test scoring calculation logic

Test cases:
1. Should calculate correct score for all indicators
2. Should return 'High Circular Potential' for score >= 80
3. Should return 'Ready' for score 60-79
4. Should return 'Developing' for score 40-59
5. Should return 'Low Readiness' for score < 40
6. Should detect anomaly for high carbon claim without evidence
7. Should detect inconsistency between high score and low documentation
8. Should calculate confidence based on evidence quality
9. Should handle missing data gracefully
10. Should apply AI adjustments correctly

Requirements:
- Use Jest testing framework
- Mock dependencies (AI service, database)
- Test edge cases
- Clear test descriptions
- Arrange-Act-Assert pattern
- 100% code coverage

Tech stack: Jest, NestJS testing utilities
```

---

## 6. Generate Form Validation Schema

```
Buatkan Zod validation schema untuk CircularFund submission form:

Form: Circular Practice Submission
Purpose: Validate UMKM submission data before sending to API

Fields:
1. resourceReductionPercentage: number (0-100, optional)
2. resourceReductionDetails: string (min 20 chars if percentage provided)
3. reuseFrequency: enum ('none', 'occasional', 'regular', 'systematic')
4. reuseDetails: string (required if not 'none')
5. recycleType: enum ('none', 'partner', 'internal')
6. recycleDetails: string (required if not 'none')
7. productLifespanYears: number (0-50, required)
8. productRepairability: boolean (required)
9. productDetails: string (min 20 chars)
10. processEfficiencyImprovement: number (0-200, optional)
11. documentationLevel: enum ('minimal', 'basic', 'comprehensive', 'full')
12. traceabilitySystem: boolean
13. carbonReductionKg: number (0-100000, optional)
14. carbonCalculationMethod: enum (required if carbonReductionKg provided)
15. localEmployees: number (1-1000, required)
16. incomeStability: enum ('unstable', 'moderate', 'stable')

Requirements:
- Conditional validation (if X then Y required)
- Custom error messages in Bahasa Indonesia
- Type-safe with TypeScript
- Reusable schema
- Integration with React Hook Form

Tech stack: Zod, React Hook Form, TypeScript
```

---

## 7. Generate UI Design System

```
Buatkan design system configuration untuk CircularFund:

Purpose: Consistent styling across the application

Requirements:

1. Color Palette:
- Primary: Green shades (sustainability theme)
- Secondary: Blue shades (trust theme)
- Accent: Orange shades (energy theme)
- Neutral: Gray shades
- Semantic: Success, Warning, Error, Info

2. Typography:
- Font family: Inter
- Heading scales (h1-h6)
- Body text sizes
- Font weights

3. Spacing:
- Base unit: 4px
- Scale: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64

4. Border Radius:
- sm, md, lg, xl, full

5. Shadows:
- sm, md, lg, xl

6. Breakpoints:
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

Format: Tailwind CSS configuration (tailwind.config.js)
Include: Custom colors, fonts, spacing, animations
```

---

## 8. Generate Documentation

```
Buatkan API documentation untuk CircularFund endpoint:

Endpoint: POST /api/umkm/submissions
Purpose: Submit circular practice data untuk scoring

Documentation should include:
1. Endpoint description
2. Authentication requirements (JWT Bearer token)
3. Request body schema (JSON)
4. Request example
5. Response schema
6. Response examples (success & error)
7. Error codes and meanings
8. Rate limiting info
9. Notes and best practices

Format: OpenAPI 3.0 (Swagger) YAML
Style: Clear, concise, with examples
Language: English for technical terms, Bahasa Indonesia for descriptions
```

---

## 9. Generate Deployment Configuration

```
Buatkan deployment configuration untuk CircularFund:

Service: Backend API (NestJS)
Platform: Railway

Requirements:
1. Dockerfile for containerization
2. railway.json configuration
3. Environment variables setup
4. Health check endpoint
5. Graceful shutdown
6. Auto-restart on failure
7. Resource limits (memory, CPU)
8. Logging configuration
9. Database migration on deploy
10. Zero-downtime deployment

Include:
- Dockerfile (multi-stage build for optimization)
- railway.json
- .dockerignore
- Health check implementation
- Deployment script

Tech stack: NestJS, Docker, Railway, PostgreSQL
```

---

## 10. Generate Performance Optimization

```
Analyze dan optimize CircularFund backend performance:

Current issue: UMKM discovery endpoint slow (>2s response time)

Endpoint: GET /api/investor/umkm
Current implementation: TypeORM query with multiple joins

Optimization tasks:
1. Analyze current query performance (EXPLAIN ANALYZE)
2. Add database indexes
3. Implement query optimization (select only needed fields)
4. Add caching layer (Redis)
5. Implement pagination properly
6. Add database connection pooling
7. Optimize N+1 queries
8. Add query result caching
9. Implement lazy loading for relations
10. Add performance monitoring

Provide:
- Optimized TypeORM query
- Index creation SQL
- Redis caching implementation
- Performance comparison (before/after)
- Monitoring setup

Target: <500ms response time
Tech stack: NestJS, TypeORM, PostgreSQL, Redis
```

---

## Tips Menggunakan Prompts

1. **Be Specific**: Semakin detail prompt, semakin baik hasil
2. **Include Context**: Berikan context tentang project (tech stack, requirements)
3. **Provide Examples**: Jika ada, berikan contoh format yang diinginkan
4. **Iterate**: Jika hasil belum sesuai, refine prompt dan coba lagi
5. **Combine**: Gabungkan beberapa prompt untuk task yang kompleks

## Template Prompt Umum

```
Buatkan [COMPONENT_TYPE] untuk CircularFund dengan spesifikasi:

Purpose: [TUJUAN]
Requirements:
- [REQUIREMENT_1]
- [REQUIREMENT_2]
- [REQUIREMENT_3]

Input/Props:
- [INPUT_1]: [TYPE] - [DESCRIPTION]
- [INPUT_2]: [TYPE] - [DESCRIPTION]

Output/Return:
[EXPECTED_OUTPUT]

Tech Stack: [TECHNOLOGIES]
Style: [CODING_STYLE]
Language: [BAHASA_INDONESIA/ENGLISH]
```

---

**Pro Tip**: Save prompts yang sering digunakan untuk reusability!
