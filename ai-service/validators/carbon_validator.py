"""
Carbon Claim Validator
Validasi klaim pengurangan karbon dengan anomaly detection
"""

import pandas as pd
import numpy as np
from typing import Dict, List, Optional
from dataclasses import dataclass

@dataclass
class CarbonValidationResult:
    is_valid: bool
    confidence: float
    flags: List[str]
    suggestions: List[str]
    adjusted_score: Optional[float] = None

class CarbonValidator:
    """
    Validator untuk klaim pengurangan karbon
    Menggunakan industry benchmarks dan statistical analysis
    """
    
    # Industry benchmarks (kg CO2 per year)
    BENCHMARKS = {
        'Fashion': {
            'small': {'min': 100, 'max': 2000, 'typical': 500},
            'medium': {'min': 500, 'max': 5000, 'typical': 2000},
            'large': {'min': 2000, 'max': 20000, 'typical': 8000},
        },
        'F&B': {
            'small': {'min': 200, 'max': 3000, 'typical': 800},
            'medium': {'min': 1000, 'max': 8000, 'typical': 3000},
            'large': {'min': 3000, 'max': 30000, 'typical': 12000},
        },
        'Kerajinan': {
            'small': {'min': 50, 'max': 1500, 'typical': 400},
            'medium': {'min': 300, 'max': 4000, 'typical': 1500},
            'large': {'min': 1500, 'max': 15000, 'typical': 6000},
        },
        'Pertanian': {
            'small': {'min': 500, 'max': 5000, 'typical': 2000},
            'medium': {'min': 2000, 'max': 15000, 'typical': 6000},
            'large': {'min': 5000, 'max': 50000, 'typical': 20000},
        },
        'Manufaktur': {
            'small': {'min': 1000, 'max': 10000, 'typical': 4000},
            'medium': {'min': 5000, 'max': 30000, 'typical': 12000},
            'large': {'min': 10000, 'max': 100000, 'typical': 40000},
        },
    }
    
    # Calculation method factors
    METHOD_FACTORS = {
        'waste_diverted': 2.0,  # kg waste = ~2 kg CO2
        'energy_saved': 0.5,    # kWh = ~0.5 kg CO2
        'transport_reduced': 0.2, # km = ~0.2 kg CO2
        'other': 1.0,
    }
    
    def validate_carbon_claim(
        self,
        carbon_reduction_kg: float,
        calculation_method: str,
        sector: str,
        business_scale: str,
        evidence_count: int,
        details: Optional[str] = None
    ) -> CarbonValidationResult:
        """
        Validasi klaim pengurangan karbon
        
        Args:
            carbon_reduction_kg: Jumlah CO2 yang diklaim (kg/tahun)
            calculation_method: Metode kalkulasi
            sector: Sektor bisnis
            business_scale: Skala bisnis (small/medium/large)
            evidence_count: Jumlah bukti yang diupload
            details: Penjelasan detail (optional)
            
        Returns:
            CarbonValidationResult dengan validasi lengkap
        """
        flags = []
        suggestions = []
        confidence = 0.7  # Base confidence
        is_valid = True
        adjusted_score = None
        
        # 1. Check if sector exists in benchmarks
        if sector not in self.BENCHMARKS:
            flags.append(f"Sektor '{sector}' tidak ditemukan dalam database benchmark")
            confidence -= 0.2
            sector = 'Kerajinan'  # Default fallback
        
        # 2. Check if scale is valid
        if business_scale not in ['small', 'medium', 'large']:
            flags.append("Skala bisnis tidak valid")
            confidence -= 0.1
            business_scale = 'small'  # Default fallback
        
        # 3. Get benchmark for sector and scale
        benchmark = self.BENCHMARKS[sector][business_scale]
        
        # 4. Check if carbon reduction is within realistic range
        if carbon_reduction_kg < benchmark['min']:
            flags.append(
                f"Klaim pengurangan karbon terlalu rendah untuk sektor {sector} "
                f"skala {business_scale}. Minimum realistis: {benchmark['min']} kg/tahun"
            )
            confidence -= 0.1
        
        if carbon_reduction_kg > benchmark['max']:
            flags.append(
                f"⚠️ PERINGATAN: Klaim pengurangan karbon sangat tinggi! "
                f"Maksimum realistis untuk {sector} skala {business_scale}: {benchmark['max']} kg/tahun"
            )
            confidence -= 0.3
            is_valid = False
            suggestions.append(
                "Verifikasi ulang perhitungan Anda. Jika benar, sertakan bukti "
                "dokumentasi yang sangat detail (invoice, meteran, sertifikat)"
            )
        
        # 5. Check if claim is unusually high (outlier detection using IQR)
        typical = benchmark['typical']
        if carbon_reduction_kg > typical * 3:
            flags.append(
                f"Klaim {carbon_reduction_kg:.0f} kg jauh di atas rata-rata "
                f"({typical:.0f} kg) untuk bisnis serupa"
            )
            confidence -= 0.15
            suggestions.append(
                "Klaim Anda 3x lebih tinggi dari rata-rata. Pastikan perhitungan "
                "sudah benar dan sertakan bukti yang kuat"
            )
        
        # 6. Validate calculation method
        if calculation_method not in self.METHOD_FACTORS:
            flags.append(f"Metode kalkulasi '{calculation_method}' tidak dikenali")
            confidence -= 0.1
            suggestions.append(
                "Gunakan metode kalkulasi standar: waste_diverted, energy_saved, "
                "atau transport_reduced"
            )
        
        # 7. Check evidence sufficiency
        min_evidence = self._calculate_min_evidence(carbon_reduction_kg, typical)
        
        if evidence_count < min_evidence:
            flags.append(
                f"Bukti tidak cukup. Untuk klaim {carbon_reduction_kg:.0f} kg, "
                f"minimal {min_evidence} file bukti diperlukan"
            )
            confidence -= 0.2
            suggestions.append(
                f"Upload minimal {min_evidence - evidence_count} bukti tambahan: "
                "invoice pembelian, meteran listrik, timbangan sampah, atau sertifikat"
            )
            
            # Adjust score if evidence insufficient
            if carbon_reduction_kg > typical * 2:
                adjusted_score = -3  # Penalty for high claim with low evidence
        
        # 8. Check details text quality
        if details:
            detail_quality = self._analyze_details(details)
            confidence += detail_quality['confidence_boost']
            
            if detail_quality['is_vague']:
                suggestions.append(
                    "Penjelasan terlalu singkat. Tambahkan detail: metode pengukuran, "
                    "periode waktu, baseline sebelumnya, dan cara kalkulasi"
                )
        else:
            flags.append("Tidak ada penjelasan detail")
            confidence -= 0.1
            suggestions.append(
                "Tambahkan penjelasan detail tentang bagaimana Anda menghitung "
                "pengurangan karbon"
            )
        
        # 9. Cross-check method with claim
        method_check = self._validate_method_consistency(
            carbon_reduction_kg,
            calculation_method,
            details
        )
        
        if not method_check['is_consistent']:
            flags.append(method_check['message'])
            confidence -= 0.15
            suggestions.append(method_check['suggestion'])
        
        # 10. Final confidence adjustment
        confidence = max(0.0, min(1.0, confidence))
        
        # 11. Determine validity
        if confidence < 0.4:
            is_valid = False
        
        # 12. Generate final suggestions if valid but low confidence
        if is_valid and confidence < 0.7:
            suggestions.append(
                "Tingkatkan kepercayaan dengan: (1) Upload lebih banyak bukti, "
                "(2) Berikan penjelasan detail, (3) Sertakan baseline data"
            )
        
        return CarbonValidationResult(
            is_valid=is_valid,
            confidence=round(confidence, 2),
            flags=flags,
            suggestions=suggestions,
            adjusted_score=adjusted_score
        )
    
    def _calculate_min_evidence(self, claim: float, typical: float) -> int:
        """Calculate minimum evidence required based on claim size"""
        ratio = claim / typical
        
        if ratio < 0.5:
            return 1  # Low claim, minimal evidence
        elif ratio < 1.5:
            return 2  # Normal claim
        elif ratio < 3:
            return 4  # High claim
        else:
            return 6  # Very high claim, need strong evidence
    
    def _analyze_details(self, details: str) -> Dict:
        """Analyze quality of details text"""
        word_count = len(details.split())
        
        # Check for key terms
        key_terms = [
            'baseline', 'pengukuran', 'kalkulasi', 'metode', 
            'periode', 'tahun', 'bulan', 'kg', 'ton'
        ]
        
        key_term_count = sum(1 for term in key_terms if term.lower() in details.lower())
        
        is_vague = word_count < 20 or key_term_count < 2
        confidence_boost = min(0.15, (word_count / 100) * 0.1 + (key_term_count / len(key_terms)) * 0.05)
        
        return {
            'is_vague': is_vague,
            'confidence_boost': confidence_boost,
            'word_count': word_count,
            'key_term_count': key_term_count
        }
    
    def _validate_method_consistency(
        self,
        carbon_kg: float,
        method: str,
        details: Optional[str]
    ) -> Dict:
        """Validate if calculation method is consistent with claim"""
        
        if method == 'waste_diverted':
            # Check if details mention waste/sampah
            if details and ('sampah' in details.lower() or 'waste' in details.lower()):
                return {
                    'is_consistent': True,
                    'message': '',
                    'suggestion': ''
                }
            else:
                return {
                    'is_consistent': False,
                    'message': 'Metode "waste_diverted" tidak konsisten dengan penjelasan',
                    'suggestion': 'Jelaskan berapa kg sampah yang didaur ulang dan bagaimana menghitung CO2'
                }
        
        elif method == 'energy_saved':
            # Check if details mention energy/listrik
            if details and ('listrik' in details.lower() or 'energy' in details.lower() or 'kwh' in details.lower()):
                return {
                    'is_consistent': True,
                    'message': '',
                    'suggestion': ''
                }
            else:
                return {
                    'is_consistent': False,
                    'message': 'Metode "energy_saved" tidak konsisten dengan penjelasan',
                    'suggestion': 'Jelaskan berapa kWh listrik yang dihemat dan bagaimana menghitung CO2'
                }
        
        elif method == 'transport_reduced':
            # Check if details mention transport/transportasi
            if details and ('transport' in details.lower() or 'jarak' in details.lower() or 'km' in details.lower()):
                return {
                    'is_consistent': True,
                    'message': '',
                    'suggestion': ''
                }
            else:
                return {
                    'is_consistent': False,
                    'message': 'Metode "transport_reduced" tidak konsisten dengan penjelasan',
                    'suggestion': 'Jelaskan berapa km transportasi yang dikurangi dan bagaimana menghitung CO2'
                }
        
        return {
            'is_consistent': True,
            'message': '',
            'suggestion': ''
        }


# Example usage
if __name__ == "__main__":
    validator = CarbonValidator()
    
    # Test case 1: Realistic claim
    result1 = validator.validate_carbon_claim(
        carbon_reduction_kg=500,
        calculation_method='waste_diverted',
        sector='Fashion',
        business_scale='small',
        evidence_count=3,
        details='Kami mendaur ulang 250kg sampah kain per tahun. Dengan faktor emisi 2kg CO2/kg sampah, total pengurangan adalah 500kg CO2.'
    )
    
    print("Test 1 - Realistic claim:")
    print(f"Valid: {result1.is_valid}")
    print(f"Confidence: {result1.confidence}")
    print(f"Flags: {result1.flags}")
    print(f"Suggestions: {result1.suggestions}")
    print()
    
    # Test case 2: Unrealistic high claim
    result2 = validator.validate_carbon_claim(
        carbon_reduction_kg=10000,
        calculation_method='waste_diverted',
        sector='Fashion',
        business_scale='small',
        evidence_count=1,
        details='Banyak sampah didaur ulang'
    )
    
    print("Test 2 - Unrealistic high claim:")
    print(f"Valid: {result2.is_valid}")
    print(f"Confidence: {result2.confidence}")
    print(f"Flags: {result2.flags}")
    print(f"Suggestions: {result2.suggestions}")
    print(f"Adjusted Score: {result2.adjusted_score}")
