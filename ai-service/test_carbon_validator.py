"""
Test suite for Carbon Validator
"""

import pytest
from validators.carbon_validator import CarbonValidator

def test_realistic_claim():
    validator = CarbonValidator()
    
    result = validator.validate_carbon_claim(
        carbon_reduction_kg=500,
        calculation_method='waste_diverted',
        sector='Fashion',
        business_scale='small',
        evidence_count=3,
        details='Kami mendaur ulang 250kg sampah kain per tahun. Dengan faktor emisi 2kg CO2/kg sampah, total pengurangan adalah 500kg CO2.'
    )
    
    assert result.is_valid == True
    assert result.confidence > 0.5
    assert len(result.flags) == 0

def test_unrealistic_high_claim():
    validator = CarbonValidator()
    
    result = validator.validate_carbon_claim(
        carbon_reduction_kg=10000,
        calculation_method='waste_diverted',
        sector='Fashion',
        business_scale='small',
        evidence_count=1,
        details='Banyak sampah didaur ulang'
    )
    
    assert result.is_valid == False
    assert result.confidence < 0.5
    assert len(result.flags) > 0
    assert result.adjusted_score == -3

def test_medium_business_realistic():
    validator = CarbonValidator()
    
    result = validator.validate_carbon_claim(
        carbon_reduction_kg=2000,
        calculation_method='energy_saved',
        sector='F&B',
        business_scale='medium',
        evidence_count=4,
        details='Menghemat listrik 4000 kWh per tahun dengan panel surya. Faktor emisi 0.5 kg CO2/kWh = 2000 kg CO2.'
    )
    
    assert result.is_valid == True
    assert result.confidence > 0.7

def test_insufficient_evidence():
    validator = CarbonValidator()
    
    result = validator.validate_carbon_claim(
        carbon_reduction_kg=5000,
        calculation_method='waste_diverted',
        sector='Manufaktur',
        business_scale='medium',
        evidence_count=1,
        details='Daur ulang banyak'
    )
    
    assert 'Bukti tidak cukup' in ' '.join(result.flags)
    assert len(result.suggestions) > 0

def test_method_consistency():
    validator = CarbonValidator()
    
    result = validator.validate_carbon_claim(
        carbon_reduction_kg=500,
        calculation_method='energy_saved',
        sector='Fashion',
        business_scale='small',
        evidence_count=3,
        details='Mendaur ulang sampah kain'  # Inconsistent with energy_saved
    )
    
    assert result.confidence < 0.8

if __name__ == '__main__':
    pytest.main([__file__, '-v'])
