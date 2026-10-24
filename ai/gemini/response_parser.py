"""
HaritAyan AI - Gemini Response Parser
Validates, cleans, and sanitizes multimodal AI agro-diagnostic outputs.
"""

import json
import re
from typing import Dict, Any, Optional

def clean_json_text(raw_text: str) -> str:
    """Strip markdown code blocks or wrapping text to extract pure JSON."""
    if not raw_text:
        return "{}"
    text = raw_text.strip()
    # Match ```json ... ``` or ``` ... ```
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
    if match:
        return match.group(1).strip()
    return text

def parse_diagnostic_response(raw_response_text: str) -> Dict[str, Any]:
    """
    Parses and sanitizes the Gemini response into HaritAyan's strict diagnostic format.
    Fails gracefully with valid schema defaults if JSON parsing encounters issues.
    """
    cleaned = clean_json_text(raw_response_text)
    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError as err:
        return {
            "isPlant": False,
            "cropName": "Unknown / Non-Plant",
            "cropNameGu": "અજ્ઞાત / વનસ્પતિ નથી",
            "condition": "Diagnostic Parsing Notice",
            "conditionGu": "નિદાન પાર્સિંગ સૂચના",
            "pathogenType": "Unknown",
            "severity": "None",
            "confidenceScore": 0,
            "symptoms": ["Could not decode model payload cleanly."],
            "symptomsGu": ["ડેટા વિશ્લેષણમાં ક્ષતિ આવી છે."],
            "biologicalProtocol": [],
            "biologicalProtocolGu": [],
            "chemicalProtocol": [],
            "chemicalProtocolGu": [],
            "preventionAdvisory": "Please retake the photo with good sunlight on the leaf surface.",
            "preventionAdvisoryGu": "કૃપા કરીને પૂરતા સૂર્યપ્રકાશમાં પાનનો સ્પષ્ટ ફોટો ફરીથી પાડો.",
            "rawText": raw_response_text[:300]
        }

    # Ensure required fields have valid defaults
    return {
        "isPlant": bool(data.get("isPlant", True)),
        "cropName": str(data.get("cropName", "Unknown Crop")),
        "cropNameGu": str(data.get("cropNameGu", "અજ્ઞાત પાક")),
        "condition": str(data.get("condition", "Undetermined Condition")),
        "conditionGu": str(data.get("conditionGu", "અનિર્ણિત સ્થિતિ")),
        "pathogenType": str(data.get("pathogenType", "Unknown")),
        "severity": str(data.get("severity", "Moderate")),
        "confidenceScore": int(data.get("confidenceScore", 85)),
        "symptoms": list(data.get("symptoms", [])),
        "symptomsGu": list(data.get("symptomsGu", [])),
        "biologicalProtocol": list(data.get("biologicalProtocol", [])),
        "biologicalProtocolGu": list(data.get("biologicalProtocolGu", [])),
        "chemicalProtocol": list(data.get("chemicalProtocol", [])),
        "chemicalProtocolGu": list(data.get("chemicalProtocolGu", [])),
        "preventionAdvisory": str(data.get("preventionAdvisory", "")),
        "preventionAdvisoryGu": str(data.get("preventionAdvisoryGu", "")),
    }
