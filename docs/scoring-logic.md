# Scoring Logic

## Circular Readiness Score (CRS)

Total: 0-100 points

### A. Operational Circularity (60 points)

#### 1. Resource Reduction (15 points)
- **Metric**: % reduction in raw materials/energy vs baseline
- **Scoring**:
  - 0-5%: 3 points
  - 5-15%: 7 points
  - 15-25%: 11 points
  - >25%: 15 points

#### 2. Reuse Practice (15 points)
- **Metric**: Material/packaging reuse frequency
- **Scoring**:
  - No reuse: 0 points
  - Occasional (<25%): 5 points
  - Regular (25-50%): 10 points
  - Systematic (>50%): 15 points

#### 3. Recycle Integration (10 points)
- **Metric**: Recycling process integration
- **Scoring**:
  - No recycling: 0 points
  - Partner-based: 5 points
  - Internal process: 10 points

#### 4. Product Durability (10 points)
- **Metric**: Product lifespan & repairability
- **Scoring**:
  - Single-use: 0 points
  - <1 year: 3 points
  - 1-3 years: 6 points
  - >3 years + repairable: 10 points

#### 5. Process Efficiency (10 points)
- **Metric**: Output per input ratio improvement
- **Scoring**:
  - No improvement: 0 points
  - 5-15% improvement: 4 points
  - 15-30% improvement: 7 points
  - >30% improvement: 10 points

### B. Ethics & Governance (15 points)

#### Transparency & Traceability (15 points)
- **Metric**: Evidence completeness
- **Scoring**:
  - Minimal documentation: 3 points
  - Basic evidence (photos): 7 points
  - Comprehensive (invoices, records): 12 points
  - Full traceability system: 15 points

### C. Impact Proxy (25 points)

#### 1. Carbon Avoidance Proxy (15 points)
- **Metric**: Estimated CO2 reduction (activity-based)
- **Scoring**:
  - <100 kg CO2/year: 3 points
  - 100-500 kg: 7 points
  - 500-1000 kg: 11 points
  - >1000 kg: 15 points

#### 2. Livelihood Impact (10 points)
- **Metric**: Local employment & income stability
- **Scoring**:
  - 1-2 workers: 3 points
  - 3-5 workers: 6 points
  - >5 workers + stable income: 10 points

## AI Scoring Process

### Input Processing
```
1. Parse structured form data
2. Extract evidence metadata (file types, dates)
3. OCR text from images (if applicable)
4. Validate data consistency
```

### AI Tasks
```
1. Estimate score per indicator
2. Cross-check claims vs evidence
3. Detect anomalies:
   - Unrealistic reduction claims
   - Missing evidence for high scores
   - Inconsistent time periods
4. Generate confidence score (0-1)
```

### Output Format
```json
{
  "totalScore": 72,
  "breakdown": {
    "operationalCircularity": 42,
    "ethics": 12,
    "impact": 18
  },
  "indicators": {
    "resourceReduction": { "score": 11, "confidence": 0.85 },
    "reuseP ractice": { "score": 10, "confidence": 0.90 }
  },
  "flags": [
    "High carbon reduction claim - verify evidence"
  ],
  "recommendation": "Ready"
}
```

## Recommendation Tags

- **Low Readiness** (0-39): Not eligible
- **Developing** (40-59): Eligible, needs improvement
- **Ready** (60-79): Good circular practices
- **High Circular Potential** (80-100): Excellent practices

## Baseline Calculation

Each UMKM establishes baseline during first submission:
- Initial resource usage
- Current practices
- Starting metrics

Future scores measure improvement against this baseline.
