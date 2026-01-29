-- CircularFund Database Schema

-- Users table (both UMKM and Kreditor)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('UMKM', 'KREDITOR')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- UMKM profiles
CREATE TABLE umkm_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    sector VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    established_year INTEGER,
    employee_count INTEGER,
    phone VARCHAR(50),
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Kreditor profiles
CREATE TABLE kreditor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    organization VARCHAR(255),
    investment_focus TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Circular practice submissions
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    umkm_id UUID REFERENCES umkm_profiles(id) ON DELETE CASCADE,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SCORED', 'FLAGGED')),
    
    -- Operational Circularity Data
    resource_reduction_percentage DECIMAL(5,2),
    resource_reduction_details TEXT,
    
    reuse_frequency VARCHAR(50),
    reuse_details TEXT,
    
    recycle_type VARCHAR(50),
    recycle_details TEXT,
    
    product_lifespan_years DECIMAL(4,1),
    product_repairability BOOLEAN,
    product_details TEXT,
    
    process_efficiency_improvement DECIMAL(5,2),
    process_details TEXT,
    
    -- Ethics & Governance
    documentation_level VARCHAR(50),
    traceability_system BOOLEAN,
    
    -- Impact Proxy
    carbon_reduction_kg DECIMAL(10,2),
    carbon_calculation_method TEXT,
    
    local_employees INTEGER,
    income_stability VARCHAR(50),
    
    -- Baseline data (for first submission)
    is_baseline BOOLEAN DEFAULT FALSE,
    baseline_resource_usage DECIMAL(10,2),
    baseline_energy_usage DECIMAL(10,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Evidence files
CREATE TABLE evidence_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    indicator_category VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scores
CREATE TABLE scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
    umkm_id UUID REFERENCES umkm_profiles(id) ON DELETE CASCADE,
    
    -- Total score
    total_score INTEGER NOT NULL CHECK (total_score >= 0 AND total_score <= 100),
    
    -- Category scores
    operational_circularity_score DECIMAL(5,2),
    ethics_score DECIMAL(5,2),
    impact_score DECIMAL(5,2),
    
    -- Indicator breakdown
    resource_reduction_score DECIMAL(5,2),
    reuse_practice_score DECIMAL(5,2),
    recycle_integration_score DECIMAL(5,2),
    product_durability_score DECIMAL(5,2),
    process_efficiency_score DECIMAL(5,2),
    transparency_score DECIMAL(5,2),
    carbon_avoidance_score DECIMAL(5,2),
    livelihood_impact_score DECIMAL(5,2),
    
    -- AI metadata
    ai_confidence DECIMAL(3,2),
    ai_flags JSONB,
    
    -- Recommendation
    recommendation VARCHAR(50) CHECK (recommendation IN ('Low Readiness', 'Developing', 'Ready', 'High Circular Potential')),
    
    scored_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Score history view for tracking progress
CREATE VIEW score_history AS
SELECT 
    s.umkm_id,
    u.business_name,
    sc.total_score,
    sc.recommendation,
    sc.scored_at,
    sub.submission_date
FROM scores sc
JOIN submissions sub ON sc.submission_id = sub.id
JOIN umkm_profiles u ON sc.umkm_id = u.id
ORDER BY sc.scored_at DESC;

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_submissions_umkm ON submissions(umkm_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_scores_umkm ON scores(umkm_id);
CREATE INDEX idx_scores_total ON scores(total_score);
CREATE INDEX idx_evidence_submission ON evidence_files(submission_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_umkm_profiles_updated_at BEFORE UPDATE ON umkm_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
