# System Architecture

## Overview

CircularFund is a three-tier application with clear separation of concerns:

```
┌─────────────────┐
│   Next.js UI    │ ← UMKM & Investor interfaces
└────────┬────────┘
         │ REST API
┌────────▼────────┐
│   NestJS API    │ ← Business logic, AI scoring
└────────┬────────┘
         │
    ┌────┴────┬──────────┐
    │         │          │
┌───▼───┐ ┌──▼──┐  ┌────▼────┐
│ PostgreSQL│ │ S3  │  │ AI Layer│
└─────────┘ └─────┘  └─────────┘
```

## Core Components

### 1. Authentication Service
- JWT-based auth
- Role-based access (UMKM, Investor)
- Session management

### 2. UMKM Service
- Profile management
- Circular practice submission
- Evidence upload
- Score history

### 3. Scoring Engine
- Rule-based calculation
- AI-assisted validation
- Consistency checking
- Anomaly detection

### 4. Investor Service
- UMKM browsing
- Filtering & search
- Report generation

### 5. File Service
- Evidence storage
- Image processing
- PDF generation

## Data Flow: Scoring Process

```
1. UMKM submits form + evidence
2. Backend validates structure
3. AI pre-scores indicators
4. Rule engine calculates CRS
5. Flags inconsistencies
6. Stores score + breakdown
7. Returns result to UMKM
8. Makes profile visible to investors
```

## Security Considerations

- All endpoints require authentication
- Role-based authorization
- File upload validation (type, size)
- SQL injection prevention (ORM)
- XSS protection
- Rate limiting on API
