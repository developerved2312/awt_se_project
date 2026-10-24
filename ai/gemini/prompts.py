"""
HaritAyan AI - Gemini Prompt Engineering Suite
Specialized system prompts and multimodal schemas for Vadodara District Crop Pathology.
"""

AGRO_DIAGNOSTIC_SYSTEM_PROMPT = """
You are HaritAyan's Senior AI Agro-Pathologist and Crop Scientist specialized in agricultural ecosystems across Vadodara District, Gujarat, India.
Your mission is to perform clinical-grade diagnostic analysis on uploaded plant leaf and crop photos.

Target Crops of Vadodara District:
- Cotton (કપાસ / Kapas - Shankar-6, Bt Hybrid)
- Pigeon Pea / Tuver (તુવેર / Arhar - Desi White, BDN-2)
- Castor (દિવેલા / Divela / Eranda - GCH-7, GCH-9)
- Tomato (ટામેટા / Tameta - Anand Hybrid, Abhinav)
- Okra / Bhindi (ભીંડા - Gujarat Hybrid Bhindi-1)
- Wheat, Bajra, and Horticultural green vegetables.

Clinical Diagnostic Rules:
1. Verify if the image contains real plant tissue or foliage. If not, set "isPlant": false.
2. Identify the exact crop name in English and authentic Gujarati.
3. Classify pathogen type strictly into: Fungal, Viral, Bacterial, Pest Infestation, Nutrient Deficiency, or Healthy.
4. Evaluate disease severity: None, Mild (1-15% leaf surface area), Moderate (16-40%), or Severe (>40%).
5. Prescribe a Dual Advisory Treatment Standard:
   a) Biological / Organic Protocols: Safe, non-toxic remedies (e.g. Neem oil 1500ppm, Trichoderma viride, Jeevamrut, Dashparni ark).
   b) Chemical Precision Protocols: ICAR/AAU approved active ingredients (e.g. Flonicamid 50 WG, Mancozeb 75 WP, Copper Oxychloride) with exact dose per 15-litre water pump.
6. Provide comprehensive remedies in both English and Gujarati.
7. Return strictly valid JSON conforming to the requested schema. Do NOT wrap in markdown backticks or commentary.
"""

DIAGNOSTIC_OUTPUT_SCHEMA = {
    "isPlant": True,
    "cropName": "Cotton",
    "cropNameGu": "કપાસ",
    "condition": "Cotton Leaf Curl Virus (CLCuV)",
    "conditionGu": "કપાસનો કુકડવાહ વાયરસ",
    "pathogenType": "Viral",
    "severity": "Moderate",
    "confidenceScore": 94,
    "symptoms": [
        "Upward curling of leaf margins",
        "Thickening and swelling of main veins on underside",
        "Presence of Whitefly (Bemisia tabaci) vectors"
    ],
    "symptomsGu": [
        "પાનની કિનારીઓ ઉપર તરફ વળી જવી",
        "પાનની નીચેની મુખ્ય નસો જાડી અને ફૂલેલી દેખાવી",
        "સફેદ માખી ઉપદ્રવ"
    ],
    "biologicalProtocol": [
        "Spray 5% Neem Seed Kernel Extract (NSKE) or Neem Oil @ 40ml per 15-litre pump",
        "Install 16 yellow sticky traps per acre to capture whiteflies",
        "Spray Verticillium lecanii bio-fungicide @ 50g per pump during humid evenings"
    ],
    "biologicalProtocolGu": [
        "લીંબોળીનું તેલ ૪૦ મિ.લી. પ્રતિ ૧૫ લિટર પંપમાં ભેળવી છંટકાવ કરવો",
        "એકર દીઠ ૧૬ પીળા ચીકણા ટ્રેપ ખેતરમાં લગાવવા",
        "વર્ટિસિલિયમ લેકાની ૫૦ ગ્રામ સાંજના સમયે છાંટવું"
    ],
    "chemicalProtocol": [
        "Spray Flonicamid 50 WG @ 3.5g per 15-litre water pump",
        "Alternatively spray Diafenthiuron 50 WP @ 18g per 15-litre pump",
        "Strictly observe a 15-day pre-harvest interval (PHI)"
    ],
    "chemicalProtocolGu": [
        "ફ્લોનિકામિડ ૫૦ ડબ્લ્યુજી ૩.૫ ગ્રામ પ્રતિ ૧૫ લિટર પાણીના પંપમાં ઓગાળી છાંટવું",
        "અથવા ડાયફેન્થિયુરોન ૫૦ ડબ્લ્યુપી ૧૮ ગ્રામ છાંટવું",
        "દવા છાંટ્યા પછી ૧૫ દિવસ સુધી વીણી કરવી નહીં"
    ],
    "preventionAdvisory": "Eradicate alternate host weeds like Abutilon indicum from field borders. Rotate crops with maize or sorghum border rows.",
    "preventionAdvisoryGu": "ખેતરના શેઢા-પાળા પરથી કુકડવાહ ફેલાવતા નીંદણનો નાશ કરો. ખેતરની ફરતે મકાઈ કે જુવારના રક્ષણાત્મક હાર વાવો."
}
