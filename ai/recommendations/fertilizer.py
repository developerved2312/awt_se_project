"""
HaritAyan AI - Balanced Fertilizer & Soil Nutrition Advisory
Computes NPK balances and integrates Anand Agricultural University (AAU) recommendations.
"""

from typing import Dict, Any

def calculate_npk_recommendation(crop_name: str, target_yield_quintals: float = 20.0) -> Dict[str, Any]:
    """
    Computes required Nitrogen, Phosphorus, Potassium (kg/ha) with organic supplementation.
    """
    standards = {
        "Cotton": {"N": 120, "P": 60, "K": 60, "manure_tons": 10},
        "Pigeon Pea": {"N": 20, "P": 50, "K": 0, "manure_tons": 5},
        "Castor": {"N": 75, "P": 50, "K": 0, "manure_tons": 8},
        "Tomato": {"N": 150, "P": 80, "K": 100, "manure_tons": 20},
        "Okra": {"N": 100, "P": 50, "K": 50, "manure_tons": 12},
    }

    req = standards.get(crop_name, standards["Cotton"])

    return {
        "crop": crop_name,
        "recommended_NPK_kg_ha": f"{req['N']}:{req['P']}:{req['K']}",
        "nitrogen_kg": req["N"],
        "phosphorus_kg": req["P"],
        "potash_kg": req["K"],
        "organic_compost_tons_ha": req["manure_tons"],
        "biofertilizers": [
            "Azotobacter / Rhizobium @ 250g per 10kg seed treatment",
            "Phosphate Solubilizing Bacteria (PSB) @ 2.5 kg/ha soil application"
        ],
        "schedule": [
            "Basal dose: 50% N + 100% P + 100% K at sowing time",
            "First top dressing: 25% N at 30 days after sowing",
            "Second top dressing: 25% N at flowering stage"
        ],
        "advisoryGu": f"{crop_name} માટે એકરે {req['N']} કિ.ગ્રા. નાઇટ્રોજન અને {req['P']} કિ.ગ્રા. ફોસ્ફરસ યોગ્ય માત્રામાં આપવું."
    }
