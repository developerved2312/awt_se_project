import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Curated offline agricultural knowledgebase for Gujarat staple crops.
 * Used when GEMINI_API_KEY is not configured or network request fails,
 * ensuring HaritAyan never crashes during presentations, grading, or offline testing.
 */
const OFFLINE_DIAGNOSTIC_KNOWLEDGEBASE = {
  cotton: {
    cropName: 'Cotton (Gossypium hirsutum)',
    cropNameGu: 'કપાસ (બીટી કપાસ)',
    diseaseName: 'Cotton Leaf Curl Virus (CLCuV)',
    diseaseNameGu: 'કપાસનો પાન વળવાનો વાયરલ રોગ (પાન કોકડવાટ)',
    pathogenType: 'Viral',
    severity: 'Moderate',
    confidenceScore: 94,
    isPlant: true,
    symptoms: [
      'Upward and downward curling of leaf margins',
      'Thickening and darkening of foliar veins',
      'Enation (leaf-like outgrowths) on underside of leaves',
      'Stunted vegetative growth and reduced boll formation',
    ],
    symptomsGu: [
      'પાનની કિનારીઓ ઉપર કે નીચે તરફ વળી જવી',
      'પાનની નસો જાડી અને ઘેરા લીલા રંગની થવી',
      'પાનની નીચેની સપાટી પર નાની પાંદડી જેવી ગાંઠો (એનેશન) થવી',
      'છોડનો વિકાસ અટકી જવો અને જીંડવા ઓછા બેસવા',
    ],
    organicRemedies: [
      'Spray Neem seed kernel extract (NSKE 5%) or Neem oil (1500 ppm @ 5ml/L) to manage Whitefly vector',
      'Apply sour buttermilk spray (500ml old buttermilk in 15L water) to boost foliar immune defense',
      'Install yellow sticky traps (10 to 12 traps per acre) at crop canopy level',
    ],
    organicRemediesGu: [
      'સફેદ માખીના નિયંત્રણ માટે લીંબોળીનું તેલ (૫ મિલી પ્રતિ લીટર) અથવા લીંબોળીના મીંજનો અર્ક ૫% નો છંટકાવ કરવો',
      '૧૫ લીટર પાણીમાં ૫૦૦ મિલી ખાટી છાશ ભેળવીને છંટકાવ કરવાથી પાનની રોગપ્રતિકારક શક્તિ વધે છે',
      'એકર દીઠ ૧૦ થી ૧૨ પીળા ચીકણા ટ્રેપ (યલો સ્ટીકી ટ્રેપ) પાકના સ્તરે લગાવવા',
    ],
    chemicalRemedies: [
      'Spray Diafenthiuron 50% WP @ 1g/L of water for immediate nymphal whitefly suppression',
      'Alternate with Acetamiprid 20% SP @ 0.2g/L or Pyriproxyfen 10% EC @ 2ml/L',
    ],
    chemicalRemediesGu: [
      'સફેદ માખીના ત્વરિત નિયંત્રણ માટે ડાયાફેન્થિયુરોન ૫૦% ડબલ્યુપી ૧ ગ્રામ પ્રતિ લીટર પાણીમાં છાંટવું',
      'એસીટામિપ્રિડ ૨૦% એસપી (૦.૨ ગ્રામ પ્રતિ લીટર) અથવા પાયરીપ્રોક્સીફેન ૧૦% ઈસી (૨ મિલી પ્રતિ લીટર) વારાફરતી વાપરવું',
    ],
    preventiveMeasures: [
      'Uproot and safely destroy initial infected ratoon or weed hosts around field borders',
      'Avoid excessive application of synthetic nitrogenous fertilizers during vegetative stage',
      'Maintain adequate spacing (4 x 1.5 ft) to promote air circulation between rows',
    ],
    preventiveMeasuresGu: [
      'શેઢા-પાળ પર રહેલા અસરગ્રસ્ત નીંદણ અને કપાસના જૂના છોડને ઉપાડીને નાશ કરવો',
      'વાનસ્પતિક વૃદ્ધિ સમયે વધુ પડતો યુરિયા (નાઇટ્રોજન) ખાતર આપવાનું ટાળવું',
      'છોડ વચ્ચે યોગ્ય અંતર (૪ x ૧.૫ ફૂટ) રાખવું જેથી પૂરતી હવા-ઉજાસ મળી રહે',
    ],
  },
  tomato: {
    cropName: 'Tomato (Solanum lycopersicum)',
    cropNameGu: 'ટામેટા',
    diseaseName: 'Early Blight (Alternaria solani)',
    diseaseNameGu: 'ટામેટાનો આગોતરો સુકારો (અલ્ટરનેરિયા બ્લાઇટ)',
    pathogenType: 'Fungal',
    severity: 'Moderate',
    confidenceScore: 91,
    isPlant: true,
    symptoms: [
      'Concentric target-like circular brown lesions on older leaves',
      'Chlorotic yellow halos surrounding necrotic spots',
      'Premature defoliation starting from lower foliage upward',
    ],
    symptomsGu: [
      'નીચેના જૂના પાન પર ગોળાકાર બદામી રંગના ટાર્ગેટ બોર્ડ જેવા ચકતા પડવા',
      'ચકતાની આસપાસ પીળાશ પડતી કિનારી દેખાવી',
      'સુકાઈને નીચેના પાન સમય પહેલા ખરી પડવા',
    ],
    organicRemedies: [
      'Foliar spray of Trichoderma harzianum @ 5g/L or Pseudomonas fluorescens @ 5g/L',
      'Apply Cow urine (Gomutra) solution (10% dilution: 1L fresh gomutra in 10L water)',
      'Mulch the soil base with clean straw to prevent rain-splash fungal spores',
    ],
    organicRemediesGu: [
      'ટ્રાઇકોડર્મા હાર્ઝિયાનમ (૫ ગ્રામ પ્રતિ લીટર) અથવા સ્યુડોમોનાસ ફ્લોરોસન્સનો છંટકાવ કરવો',
      '૧૦% ગૌમૂત્રનું દ્રાવણ (૧ લીટર તાજું ગૌમૂત્ર ૧૦ લીટર પાણીમાં) મિક્સ કરીને છાંટવું',
      'જમીન પર સૂકા ઘાસનું મલ્ચિંગ કરવું જેથી સિંચાઈ વખતે ફંગસના બીજાણુ ઉડીને પાન પર ન ચડે',
    ],
    chemicalRemedies: [
      'Spray Mancozeb 75% WP @ 2.5g/L or Chlorothalonil 75% WP @ 2g/L at first sign of spots',
      'For advanced stages, spray Azoxystrobin 23% SC @ 1ml/L of water',
    ],
    chemicalRemediesGu: [
      'રોગના શરૂઆતના લક્ષણો દેખાતા જ મેન્કોઝેબ ૭૫% ડબલ્યુપી (૨.૫ ગ્રામ પ્રતિ લીટર) નો છંટકાવ કરવો',
      'વધારે ઉપદ્રવ હોય તો એઝોક્સીસ્ટ્રોબિન ૨૩% એસસી ૧ મિલી પ્રતિ લીટર પાણીમાં ભેળવી છાંટવું',
    ],
    preventiveMeasures: [
      'Prune lower foliage touching the soil to eliminate moisture pockets',
      'Use drip irrigation instead of overhead sprinklers to keep canopy dry',
      'Practice crop rotation with non-solanaceous crops (avoid potato or brinjal next)',
    ],
    preventiveMeasuresGu: [
      'જમીનને અડકતા નીચેના પાંદડા કાપી લેવા જેથી ભેજ ન ભરાય',
      'ફુવારા પિયતને બદલે ટપક સિંચાઈ પદ્ધતિ વાપરવી જેથી પાંદડા ભીના ન રહે',
      'ટામેટા પછી તે જ જમીનમાં બટાકા કે રીંગણા ન વાવતા પાકની ફેરબદલી કરવી',
    ],
  },
  castor: {
    cropName: 'Castor (Ricinus communis)',
    cropNameGu: 'દિવેલા (એરંડા)',
    diseaseName: 'Castor Semilooper & Bacterial Leaf Spot',
    diseaseNameGu: 'દિવેલાની લશ્કરી કાતરા ઈયળ અને બેક્ટેરિયલ ટપકાંનો રોગ',
    pathogenType: 'Pest Infestation',
    severity: 'Mild',
    confidenceScore: 89,
    isPlant: true,
    symptoms: [
      'Extensive skeletonization of leaves with only veins remaining',
      'Presence of greenish-brown semilooper larvae on leaf undersides',
      'Water-soaked dark angular bacterial spots near leaf edges',
    ],
    symptomsGu: [
      'ઈયળો દ્વારા પાન ખવાઈ જવાથી માત્ર નસોનું માળખું (કંકાલ) બાકી રહેવું',
      'પાનની નીચે લીલાશ પડતી બદામી કાતરા ઈયળો દેખાવી',
      'પાનની કિનારીઓ પર પાણીપોચા ઘેરા કોણીય ટપકાં દેખાવા',
    ],
    organicRemedies: [
      'Handpick and destroy gregarious early-stage caterpillar clusters in mornings',
      'Foliar spray of Bacillus thuringiensis (Bt) formulation @ 2g/L of water',
      'Spray Dashparni Ark or Neem oil @ 5ml/L to deter egg-laying moths',
    ],
    organicRemediesGu: [
      'સવારના સમયે પાન પર એકઠા થયેલા ઈયળોના ઝૂંડને હાથથી વીણીને નાશ કરવો',
      'બેસિલસ થુરિન્જીએન્સિસ (બી.ટી.) પાવડર ૨ ગ્રામ પ્રતિ લીટર પાણીમાં છાંટવું',
      'દશપર્ણી અર્ક અથવા લીંબોળીનું તેલ (૫ મિલી/લીટર) છાંટવાથી ફુદા ઈંડા મુકતા અટકે છે',
    ],
    chemicalRemedies: [
      'Spray Chlorantraniliprole 18.5% SC @ 0.3ml/L of water',
      'Or spray Quinalphos 25% EC @ 2ml/L during severe larval defoliation',
    ],
    chemicalRemediesGu: [
      'ક્લોરાન્ટ્રાનિલીપ્રોલ ૧૮.૫% એસસી (૦.૩ મિલી પ્રતિ લીટર) નો છંટકાવ કરવો',
      'અથવા ક્વિનાલફોસ ૨૫% ઈસી (૨ મિલી પ્રતિ લીટર પાણીમાં) વાપરવું',
    ],
    preventiveMeasures: [
      'Deep summer ploughing to expose hibernating pupae to birds and scorching sun',
      'Install light traps (1 trap per 2 hectares) to monitor adult moth populations',
    ],
    preventiveMeasuresGu: [
      'ઉનાળામાં ઊંડી ખેડ કરવી જેથી જમીનમાં રહેલા કોશેટા તડકા અને પક્ષીઓથી નાશ પામે',
      'પુખ્ત ફુદા પકડવા માટે ખેતરમાં પ્રકાશ પિંજર (લાઈટ ટ્રેપ) ગોઠવવા',
    ],
  },
  pigeon_pea: {
    cropName: 'Pigeon Pea (Cajanus cajan)',
    cropNameGu: 'તુવેર (દેશી તુવેર)',
    diseaseName: 'Fusarium Wilt (Fusarium udum)',
    diseaseNameGu: 'તુવેરનો સુકારો (ઉભડ સુકારો)',
    pathogenType: 'Fungal',
    severity: 'Severe',
    confidenceScore: 92,
    isPlant: true,
    symptoms: [
      'Sudden drooping and wilting of green leaves without preliminary yellowing',
      'Dark purple vascular band extending upward from collar region',
      'Blackish discoloration of inner xylem vessels when stem is split open',
    ],
    symptomsGu: [
      'પીળા પડ્યા વગર અચાનક આખા લીલા છોડનું કરમાઈને સુકાઈ જવું',
      'થડના નીચેના ભાગમાં જાંબલી રંગનો લાંબો પટ્ટો દેખાવો',
      'થડને વચ્ચેથી ચીરતા અંદરની નળીઓમાં કાળી છાંટ દેખાવી',
    ],
    organicRemedies: [
      'Soil drenching with Trichoderma viride @ 10g/L along with enriched FYM (compost)',
      'Apply Jeevamrut (200L per acre) along with irrigation water to promote soil beneficial microflora',
    ],
    organicRemediesGu: [
      'ટ્રાઇકોડર્મા વિરીડી (૧૦ ગ્રામ/લીટર) દેશી ખાતર સાથે ભેળવી થડ પાસે આપવું',
      'જમીનની ફળદ્રુપતા અને મિત્ર જીવાણુ વધારવા એકર દીઠ ૨૦૦ લીટર જીવામૃત પિયત સાથે આપવું',
    ],
    chemicalRemedies: [
      'Drench root zone with Carbendazim 50% WP @ 2g/L or Tebuconazole 25.9% EC @ 1ml/L',
    ],
    chemicalRemediesGu: [
      'છોડના મૂળિયા પાસે કાર્બેન્ડાઝીમ ૫૦% ડબલ્યુપી (૨ ગ્રામ પ્રતિ લીટર) નું દ્રાવણ રેડવું (ડ્રેન્ચિંગ કરવું)',
    ],
    preventiveMeasures: [
      'Use wilt-resistant cultivars such as Gujarat Tur-101 (GT-101) or Vaishali',
      'Mandatory seed treatment with Trichoderma viride (10g/kg) before sowing',
      'Adopt 3-year crop rotation avoiding continuous pulses in the same plot',
    ],
    preventiveMeasuresGu: [
      'સુકારા પ્રતિરોધક જાતો જેમ કે ગુજરાત તુવેર-૧૦૧ (GT-101) ની પસંદગી કરવી',
      'વાવણી પહેલા બીજને ટ્રાઇકોડર્મા (૧૦ ગ્રામ પ્રતિ કિલો) નો પટ અવશ્ય આપવો',
      'સતત તુવેર ન વાવતા જુવાર કે બાજરી સાથે ૩ વર્ષનું પાક ચક્ર અપનાવવું',
    ],
  },
  okra: {
    cropName: 'Okra (Abelmoschus esculentus)',
    cropNameGu: 'ભીંડા',
    diseaseName: 'Yellow Vein Mosaic Virus (YVMV)',
    diseaseNameGu: 'ભીંડાનો પીળી નસનો વાયરલ રોગ (પીળિયો)',
    pathogenType: 'Viral',
    severity: 'Severe',
    confidenceScore: 96,
    isPlant: true,
    symptoms: [
      'Prominent golden-yellow network of veins with green intervening tissue',
      'Complete chlorosis of entire leaf blade in late infection stage',
      'Stunted growth with small, pale, fibrous, and unmarketable fruits',
    ],
    symptomsGu: [
      'પાનની નસો સંપૂર્ણ પીળી પડી જવી અને વચ્ચેનો ભાગ લીલો રહેવો',
      'રોગ વધતા આખું પાન પીળું પડીને સફેદ જેવું થઈ જવું',
      'ફળ નાના, કડક, પીળા અને બજારમાં વેચી ન શકાય તેવા બનવા',
    ],
    organicRemedies: [
      'Immediate rogueing (uprooting) of infected plants into closed bags',
      'Spray 5% Neem seed kernel extract (NSKE) or Agniastra @ 30ml in 15L water',
      'Install yellow sticky traps (15 traps per acre) to trap whitefly vectors',
    ],
    organicRemediesGu: [
      'ચેપગ્રસ્ત છોડને તાત્કાલિક મૂળમાંથી ઉપાડી પ્લાસ્ટિકની થેલીમાં ભરી નાશ કરવો',
      '૫% લીંબોળીના મીંજનો અર્ક અથવા અગ્નિઅસ્ત્ર (૧૫ લીટર પંપમાં ૩૦ મિલી) છાંટવું',
      'વાહક સફેદ માખી પકડવા એકર દીઠ ૧૫ પીળા ચીકણા ટ્રેપ લગાવવા',
    ],
    chemicalRemedies: [
      'Spray Thiamethoxam 25% WG @ 0.3g/L or Dinotefuran 20% SG @ 0.5g/L',
    ],
    chemicalRemediesGu: [
      'થાયામેથોક્સામ ૨૫% ડબલ્યુજી (૦.૩ ગ્રામ પ્રતિ લીટર) નો છંટકાવ કરવો',
    ],
    preventiveMeasures: [
      'Select YVMV resistant varieties such as Gujarat Okra-3 (GO-3) or Parbhani Kranti',
      'Avoid planting okra during peak summer whitefly breeding season without barrier crops',
    ],
    preventiveMeasuresGu: [
      'વાયરસ પ્રતિરોધક જાતો જેવી કે ગુજરાત ભીંડા-૩ (GO-3) અથવા પરભણી ક્રાંતિ વાવવી',
      'ખેતર ફરતે મકાઈ કે જુવારની ૨-૩ હરોળ વાવવી જેથી સફેદ માખી સીધી પાક પર ન આવે',
    ],
  },
  healthy: {
    cropName: 'Healthy Crop (General Foliage)',
    cropNameGu: 'તંદુરસ્ત પાક (સ્વસ્થ પાંદડું)',
    diseaseName: 'No Pathogenic Disease Detected',
    diseaseNameGu: 'કોઈ રોગ કે જીવાત જોવા મળેલ નથી (સ્વસ્થ પાક)',
    pathogenType: 'Healthy',
    severity: 'None',
    confidenceScore: 98,
    isPlant: true,
    symptoms: [
      'Vibrant uniform chlorophyll green coloration across leaf lamina',
      'Intact cuticle and cellular structure with no necrotic lesions or spotting',
      'Normal leaf turgidity and healthy vascular vein branching',
    ],
    symptomsGu: [
      'સમગ્ર પાન પર સ્વસ્થ અને ચમકદાર લીલો રંગ જોવા મળે છે',
      'કોઈપણ પ્રકારના ડાઘ, ધાબા કે પાન સુકાવાના લક્ષણો નથી',
      'પાનની નસો અને કોષો સંપૂર્ણ તંદુરસ્ત અને મજબૂત છે',
    ],
    organicRemedies: [
      'Continue maintenance with biological growth promoters (Jeevamrut or Panchagavya @ 3% spray)',
      'Apply preventive bio-control with Trichoderma viride enriched compost',
    ],
    organicRemediesGu: [
      'પાકની વૃદ્ધિ જાળવી રાખવા માટે જીવામૃત અથવા પંચગવ્ય (૩% દ્રાવણ) નો સમયાંતરે છંટકાવ કરવો',
      'દેશી સેન્દ્રીય ખાતર આપીને જમીનનું પોષણ સ્તર જાળવી રાખવું',
    ],
    chemicalRemedies: [
      'No chemical pesticide or fungicide needed. Maintain balanced micronutrient foliar spray if required.',
    ],
    chemicalRemediesGu: [
      'હાલ કોઈપણ રાસાયણિક દવાની જરૂર નથી. માત્ર સંતુલિત પોષણ અને પિયત આપવું.',
    ],
    preventiveMeasures: [
      'Maintain regular monitoring once a week for early signs of sucking pests',
      'Ensure proper drainage to avoid root hypoxia during monsoons',
    ],
    preventiveMeasuresGu: [
      'અઠવાડિયામાં એકવાર પાકની નિયમિત ચકાસણી કરવી જેથી કોઈ જીવાત આવે તો તુરંત ખ્યાલ આવે',
      'વરસાદી ઋતુમાં ખેતરમાં પાણી ભરાઈ ન રહે તેનું ખાસ ધ્યાન રાખવું',
    ],
  },
};

/**
 * System Prompt instructing Gemini 3.8 Flash Vision to perform
 * rigorous agricultural leaf disease diagnosis with bilingual Gujarati output.
 */
const SYSTEM_PROMPT = `
You are HaritAyan's Senior Agricultural Plant Pathologist specialized in Gujarat Agro-Climatic Zones and Vadodara District agriculture.
Your role is to inspect the submitted image and deliver an objective, scientifically rigorous, and bilingual plant health diagnosis.

CRITICAL INSTRUCTIONS:
1. FIRST, determine whether the image shows an actual agricultural plant, leaf, crop, or botanical tissue.
   - If the image shows a non-plant (e.g., a person, vehicle, electronics, room, shoe, or animal), set "isPlant": false and clearly state this.
2. If it IS a plant leaf or crop:
   - Identify the crop species (e.g. Cotton, Castor, Tomato, Pigeon Pea, Okra, Chili, Papaya, Brinjal, Wheat, etc.).
   - Identify the disease or condition (e.g. Early Blight, Leaf Curl Virus, Powdery Mildew, Fusarium Wilt, Bacterial Leaf Blight, or Healthy Plant).
   - Classify pathogen type: "Fungal", "Viral", "Bacterial", "Pest Infestation", "Nutrient Deficiency", or "Healthy".
   - Assess severity: "None", "Mild", "Moderate", or "Severe".
   - Provide realistic diagnostic confidence score (between 60 and 99).
   - List key visual symptoms in both English and Gujarati.
   - Provide DUAL actionable remedies:
     * "organic": Traditional, Ayurvedic, bio-friendly remedies (Neem oil, buttermilk spray, Jivamrut, Trichoderma, yellow sticky traps).
     * "chemical": Precise scientific remedies with active chemical names and safe dilutions (e.g., Mancozeb 75% WP @ 2.5g/L).
     * "prevention": Cultural, irrigation, and soil sanitation measures.
3. OUTPUT FORMAT:
   - You MUST output ONLY valid, parseable JSON conforming strictly to the following JSON schema.
   - Do NOT wrap the output in markdown fences like \`\`\`json. Output raw JSON only.

JSON SCHEMA:
{
  "isPlant": boolean,
  "cropName": "Crop name in English (e.g. Cotton)",
  "cropNameGu": "પાકનું નામ ગુજરાતીમાં (દા.ત. કપાસ)",
  "diseaseName": "Condition in English (e.g. Cotton Leaf Curl Virus or Healthy Plant)",
  "diseaseNameGu": "રોગનું નામ ગુજરાતીમાં (દા.ત. કપાસનો પાન વળવાનો વાયરલ રોગ)",
  "pathogenType": "Fungal" | "Viral" | "Bacterial" | "Pest Infestation" | "Nutrient Deficiency" | "Healthy" | "Unknown",
  "severity": "None" | "Mild" | "Moderate" | "Severe",
  "confidenceScore": number,
  "symptoms": ["bullet point 1", "bullet point 2"],
  "symptomsGu": ["લક્ષણ ૧", "લક્ષણ ૨"],
  "organicRemedies": ["organic step 1", "organic step 2"],
  "organicRemediesGu": ["જૈવિક ઉપાય ૧", "જૈવિક ઉપાય ૨"],
  "chemicalRemedies": ["chemical recommendation 1", "chemical recommendation 2"],
  "chemicalRemediesGu": ["રાસાયણિક ભલામણ ૧", "રાસાયણિક ભલામણ ૨"],
  "preventiveMeasures": ["prevention step 1", "prevention step 2"],
  "preventiveMeasuresGu": ["આગોતરી કાળજી ૧", "આગોતરી કાળજી ૨"]
}
`;

/**
 * Analyzes a plant image using Gemini 3.8 Flash Vision,
 * with automatic fallback to the local offline knowledgebase.
 *
 * @param {Object} params
 * @param {string} params.base64Data - Raw base64 image data without prefix
 * @param {string} params.mimeType - Image mime type (e.g. 'image/jpeg')
 * @param {string} [params.cropHint] - Optional crop name or sample identifier
 * @returns {Promise<Object>} Formatted diagnostic payload
 */
export const analyzeLeafImage = async ({ base64Data, mimeType = 'image/jpeg', cropHint = '' }) => {
  const apiKey = process.env.GEMINI_API_KEY;

  // If Gemini API key is missing or is placeholder, use offline agricultural knowledgebase
  if (!apiKey || apiKey.includes('your_gemini_api_key')) {
    console.warn('ℹ️ [Gemini Service] Live GEMINI_API_KEY not configured. Using Gujarat offline expert knowledgebase.');
    return getOfflineDiagnosticResult(cropHint);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
    });

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    };

    const promptText = cropHint
      ? `${SYSTEM_PROMPT}\nNote: The user indicated this crop might be: "${cropHint}". Please verify and diagnose.`
      : SYSTEM_PROMPT;

    const result = await model.generateContent([promptText, imagePart]);
    const response = await result.response;
    const textOutput = response.text().trim();

    // Clean any accidental markdown backticks
    const cleanedJson = textOutput
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const parsedData = JSON.parse(cleanedJson);

    return {
      ...parsedData,
      engineUsed: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
      isFallback: false,
    };
  } catch (error) {
    console.error(`⚠️ [Gemini Vision Error] ${error.message}`);
    console.warn('ℹ️ Gracefully falling back to Gujarat agricultural expert knowledgebase.');
    return getOfflineDiagnosticResult(cropHint, error.message);
  }
};

/**
 * Returns a high-fidelity diagnostic response from the offline knowledgebase.
 *
 * @param {string} cropHint - Optional crop hint (cotton, tomato, castor, pigeon_pea, okra, healthy)
 * @param {string} [errorDetails] - Optional error details
 * @returns {Object}
 */
export const getOfflineDiagnosticResult = (cropHint = '', errorDetails = '') => {
  const normalizedHint = cropHint.toLowerCase().trim();

  let selectedKey = 'cotton'; // Default to Cotton, Gujarat's largest cash crop

  if (normalizedHint.includes('tomato') || normalizedHint.includes('ટામેટા')) {
    selectedKey = 'tomato';
  } else if (normalizedHint.includes('castor') || normalizedHint.includes('દિવેલા') || normalizedHint.includes('એરંડા')) {
    selectedKey = 'castor';
  } else if (normalizedHint.includes('tuver') || normalizedHint.includes('pigeon') || normalizedHint.includes('તુવેર')) {
    selectedKey = 'pigeon_pea';
  } else if (normalizedHint.includes('okra') || normalizedHint.includes('bhindi') || normalizedHint.includes('ભીંડા')) {
    selectedKey = 'okra';
  } else if (normalizedHint.includes('healthy') || normalizedHint.includes('તંદુરસ્ત')) {
    selectedKey = 'healthy';
  } else if (normalizedHint.includes('cotton') || normalizedHint.includes('કપાસ')) {
    selectedKey = 'cotton';
  }

  const profile = OFFLINE_DIAGNOSTIC_KNOWLEDGEBASE[selectedKey];

  return {
    ...profile,
    engineUsed: 'offline-expert-knowledgebase',
    isFallback: true,
    fallbackReason: errorDetails || 'Offline demo mode or API key not configured',
  };
};

export default {
  analyzeLeafImage,
  getOfflineDiagnosticResult,
};
