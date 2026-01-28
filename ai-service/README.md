# CircularFund AI Scoring Service

Python-based microservice for AI-assisted validation of circular economy claims.

## Features

- Anomaly detection in submission data
- Evidence consistency checking
- OCR for document analysis
- Carbon footprint estimation
- LLM-based claim validation

## Setup

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Linux/Mac)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run service
python main.py
```

## API Endpoints

- `POST /validate` - Validate submission data
- `POST /analyze-evidence` - OCR and image analysis
- `POST /estimate-carbon` - Carbon reduction estimation

## Integration with NestJS

The NestJS backend calls this service via HTTP:

```typescript
const response = await axios.post('http://localhost:5000/validate', submissionData);
```
