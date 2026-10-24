"""
HaritAyan AI - Precision Irrigation Advisory Engine
Calculates moisture deficits and scheduling tailored to Vadodara soil types and crops.
"""

from typing import Dict, Any

def get_irrigation_schedule(crop_name: str, growth_stage: str, soil_type: str = "Black Cotton Soil") -> Dict[str, Any]:
    """
    Generates precision irrigation intervals and water requirements.
    Soil types: 'Black Cotton Soil' (heavy clay, Karjan/Padra), 'Goradu' (sandy loam, Savli/Vadodara).
    """
    base_intervals = {
        "Cotton": {
            "Vegetative": 10 if soil_type == "Black Cotton Soil" else 7,
            "Flowering/Boll": 6 if soil_type == "Black Cotton Soil" else 4,
            "Maturity": 14,
        },
        "Pigeon Pea": {
            "Vegetative": 14 if soil_type == "Black Cotton Soil" else 10,
            "Pod Development": 8 if soil_type == "Black Cotton Soil" else 6,
            "Maturity": 18,
        },
        "Tomato": {
            "Vegetative": 5,
            "Fruiting": 3,
            "Harvest": 4,
        }
    }

    crop_dict = base_intervals.get(crop_name, base_intervals["Cotton"])
    interval_days = crop_dict.get(growth_stage, 7)

    return {
        "crop": crop_name,
        "growth_stage": growth_stage,
        "soil_type": soil_type,
        "recommended_interval_days": interval_days,
        "water_depth_mm": 50 if soil_type == "Black Cotton Soil" else 40,
        "technique": "Drip Irrigation (તપક પદ્ધતિ) recommended for 40% water savings",
        "advisoryGu": f"{crop_name} માટે {soil_type} જમીનમાં દર {interval_days} દિવસે પિયત આપવું હિતાવહ છે."
    }
