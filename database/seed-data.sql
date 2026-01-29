-- Sample data for CircularFund

-- Insert sample users (passwords are hashed 'password123')
INSERT INTO users (id, email, password_hash, role) VALUES
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'umkm1@example.com', '$2b$10$rKZLvXz8Q7X8Q7X8Q7X8Q7X8Q7X8Q7X8Q7X8Q7X8Q7X8Q7X8Q7X8', 'UMKM'),
('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', 'umkm2@example.com', '$2b$10$rKZLvXz8Q7X8Q7X8Q7X8Q7X8Q7X8Q7X8Q7X8Q7X8Q7X8Q7X8Q7X8', 'UMKM'),
('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 'kreditor1@example.com', '$2b$10$rKZLvXz8Q7X8Q7X8Q7X8Q7X8Q7X8Q7X8Q7X8Q7X8Q7X8Q7X8Q7X8', 'KREDITOR');

-- Insert UMKM profiles
INSERT INTO umkm_profiles (id, user_id, business_name, sector, description, location, established_year, employee_count, phone) VALUES
('d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', 
 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
 'EcoKraft Indonesia',
 'Handicraft',
 'Sustainable handicraft using recycled materials and natural dyes',
 'Yogyakarta',
 2020,
 8,
 '+62812345678'),
 
('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b',
 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e',
 'GreenPack Solutions',
 'Packaging',
 'Biodegradable packaging from agricultural waste',
 'Bandung',
 2021,
 5,
 '+62823456789');

-- Insert kreditor profile
INSERT INTO kreditor_profiles (id, user_id, name, organization, investment_focus) VALUES
('f6a7b8c9-d0e1-4f5a-3b4c-5d6e7f8a9b0c',
 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f',
 'Sarah Kreditor',
 'Green Capital Partners',
 'Sustainable MSMEs, circular economy, social impact');

-- Insert submissions
INSERT INTO submissions (
    id, umkm_id, submission_date, status,
    resource_reduction_percentage, resource_reduction_details,
    reuse_frequency, reuse_details,
    recycle_type, recycle_details,
    product_lifespan_years, product_repairability, product_details,
    process_efficiency_improvement, process_details,
    documentation_level, traceability_system,
    carbon_reduction_kg, carbon_calculation_method,
    local_employees, income_stability,
    is_baseline, baseline_resource_usage, baseline_energy_usage
) VALUES
('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d',
 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a',
 CURRENT_TIMESTAMP - INTERVAL '30 days',
 'SCORED',
 22.5,
 'Reduced raw material usage by sourcing recycled paper and fabric scraps from local textile factories',
 'Regular (25-50%)',
 'Reuse packaging materials from suppliers, repurpose fabric scraps into new products',
 'Partner-based',
 'Partnership with local recycling center for non-reusable waste',
 3.5,
 TRUE,
 'Handcrafted bags designed for durability, offer repair service',
 18.0,
 'Optimized cutting patterns to reduce waste by 18%',
 'Comprehensive',
 TRUE,
 650.0,
 'Estimated based on recycled material usage vs virgin material production',
 8,
 'Stable',
 FALSE,
 1000.0,
 500.0
);

-- Insert evidence files
INSERT INTO evidence_files (submission_id, file_name, file_type, file_url, file_size, indicator_category) VALUES
('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 'material-invoice-2024.pdf', 'application/pdf', 's3://circularfund/evidence/material-invoice-2024.pdf', 245678, 'Resource Reduction'),
('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 'workshop-photo.jpg', 'image/jpeg', 's3://circularfund/evidence/workshop-photo.jpg', 1234567, 'Reuse Practice'),
('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 'recycling-partnership.pdf', 'application/pdf', 's3://circularfund/evidence/recycling-partnership.pdf', 189234, 'Recycle Integration');

-- Insert scores
INSERT INTO scores (
    id, submission_id, umkm_id,
    total_score,
    operational_circularity_score, ethics_score, impact_score,
    resource_reduction_score, reuse_practice_score, recycle_integration_score,
    product_durability_score, process_efficiency_score, transparency_score,
    carbon_avoidance_score, livelihood_impact_score,
    ai_confidence, ai_flags, recommendation
) VALUES
('b8c9d0e1-f2a3-4b5c-5d6e-7f8a9b0c1d2e',
 'a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d',
 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a',
 72,
 42.0, 12.0, 18.0,
 11.0, 10.0, 5.0,
 10.0, 7.0, 12.0,
 11.0, 6.0,
 0.87,
 '["Evidence quality: High", "Consistency check: Passed"]'::jsonb,
 'Ready'
);
