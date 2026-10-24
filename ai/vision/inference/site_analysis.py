"""
HaritAyan AI - Foliar Lesion & Surface Severity Scoring
Quantifies the percentage of necrotic, chlorotic, and damaged leaf area.
"""

from typing import Dict, Any

class SiteAnalyzer:
    """Calculates leaf damage surface area to objectively score disease severity."""

    @staticmethod
    def calculate_severity_metrics(damage_ratio: float) -> Dict[str, Any]:
        """
        Converts damage area ratio into agricultural classification:
        - None: 0%
        - Mild: 1 - 15%
        - Moderate: 16 - 40%
        - Severe: > 40%
        """
        percent = round(damage_ratio * 100, 1)
        if percent < 1.0:
            severity = "None"
            urgency = "Normal"
        elif percent <= 15.0:
            severity = "Mild"
            urgency = "Low"
        elif percent <= 40.0:
            severity = "Moderate"
            urgency = "Medium"
        else:
            severity = "Severe"
            urgency = "High"

        return {
            "severity": severity,
            "damage_percentage": percent,
            "urgency_level": urgency,
            "immediate_action_required": severity in ["Moderate", "Severe"]
        }
