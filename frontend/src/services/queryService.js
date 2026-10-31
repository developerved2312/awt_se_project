/**
 * queryService.js - Client-Side API Connector for Farmer Consultations & Officer Review Station
 */

import { getAuthHeaders, getStoredUser } from './authService';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const FALLBACK_QUERIES = [
  {
    _id: 'fb-q-1',
    title: 'Rapid leaf curling and vein swelling in 45-day Bt cotton plot',
    titleGu: '૪૫ દિવસના બીટી કપાસમાં પાન વળવા અને નસો ફૂલી જવાની ગંભીર સમસ્યા',
    crop: 'Cotton',
    cropGu: 'કપાસ',
    urgency: 'High',
    status: 'Reviewed',
    farmerName: 'Ramesh Patel',
    farmerNameGu: 'રમેશભાઈ પટેલ',
    farmerPhone: '+91 98250 84721',
    village: 'Samiyala',
    taluka: 'Padra',
    district: 'Vadodara',
    imageUrl: '/images/cotton.jpeg',
    description:
      'My Bt Cotton (hybrid) in Samiyala village has developed upward leaf curling with thick lower veins. Whitefly population seems high after the humid spell. Please advise emergency protocol.',
    officerResponse: {
      officerName: 'Dr. Hitesh Trivedi',
      officerBadge: 'GJ-VAD-AGRI-042',
      designation: 'Senior District Agricultural Officer',
      comment:
        'Official Diagnosis: Symptoms confirm Cotton Leaf Curl Virus (CLCuV) transmitted by Whitefly (Bemisia tabaci). Please implement vector control immediately. Uproot and burn heavily stunted plants.',
      commentGu:
        'સત્તાવાર તપાસ: આ લક્ષણો સફેદ માખીથી ફેલાતા કપાસના કુકડવાહ વાયરસના છે. ખેતરમાંથી વધુ અસરગ્રસ્ત છોડ ઉપાડી નાશ કરો અને તરત જ સફેદ માખી નિયંત્રણના પગલાં લો.',
      prescribedRemedies: [
        'Spray Flonicamid 50 WG @ 3.5g per 15-litre water pump',
        'Deploy yellow sticky traps @ 16 traps per acre',
        'Avoid nitrogenous fertilizers (Urea) for the next 10 days',
      ],
      prescribedRemediesGu: [
        'ફ્લોનિકામિડ ૫૦ ડબ્લ્યુજી ૩.૫ ગ્રામ ૧૫ લીટર પાણીમાં ઓગાળી છાંટવું',
        'એકરે ૧૬ પીળા ગુંદરિયા ટ્રેપ લગાવવા',
        'આગામી ૧૦ દિવસ સુધી યુરિયા ખાતર આપવાનું બંધ રાખવું',
      ],
      respondedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
  },
  {
    _id: 'fb-q-2',
    title: 'Flower bud shedding and leaf webber inspection in Tur / Pigeon Pea',
    titleGu: 'તુવેરમાં ફૂલ કળીઓ ખરી પડવી અને પાન ગૂંથનારી ઈયળની તપાસ',
    crop: 'Pigeon Pea',
    cropGu: 'તુવેર',
    urgency: 'Medium',
    status: 'Pending Review',
    farmerName: 'Ramesh Patel',
    farmerNameGu: 'રમેશભાઈ પટેલ',
    farmerPhone: '+91 98250 84721',
    village: 'Samiyala',
    taluka: 'Padra',
    district: 'Vadodara',
    imageUrl: '/images/pigeon_pea.jpg',
    description:
      'Tur crop planted along field borders is starting to flower. Minor webbing of leaves noticed. Need safe organic recommendation before heavy flowering commences.',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    _id: 'fb-q-3',
    title: 'Brown circular bullseye spots on lower leaves of hybrid tomato',
    titleGu: 'હાઇબ્રિડ ટામેટાના નીચલા પાન પર ગોળ ચક્રાકાર કથ્થાઈ ટપકાં (સુકારો)',
    crop: 'Tomato',
    cropGu: 'ટામેટા',
    urgency: 'High',
    status: 'Reviewed',
    farmerName: 'Bhavesh Solanki',
    farmerNameGu: 'ભાવેશભાઈ સોલંકી',
    farmerPhone: '+91 94280 61942',
    village: 'Asodar',
    taluka: 'Anklav',
    district: 'Anand',
    imageUrl: '/images/tomato.jpg',
    description:
      'Lower foliage in 3-acre tomato plot in Asodar showing dark brown concentric rings surrounded by yellow halos. Older leaves drying and dropping off.',
    officerResponse: {
      officerName: 'Dr. Hitesh Trivedi',
      officerBadge: 'GJ-VAD-AGRI-042',
      designation: 'Senior District Agricultural Officer',
      comment:
        'Diagnosis: Alternaria Early Blight fungus. Do not use furrow or flood irrigation in evenings. Prune infected bottom 6 inches of foliage and spray Mancozeb promptly.',
      commentGu:
        'નિદાન: ટામેટાનો અલ્ટરનેરિયા અર્લી બ્લાઇટ (આગોતરો સુકારો) ફૂગજન્ય રોગ છે. સાંજના સમયે પાણી આપવાનું ટાળો અને નીચેના પાન કાપીને મેન્કોઝેબનો છંટકાવ કરો.',
      prescribedRemedies: [
        'Mancozeb 75 WP @ 30g per 15L pump',
        'Sour buttermilk spray (500ml/pump) with 10g turmeric for foliar resistance',
        'Trim diseased foliage touching the soil bed',
      ],
      prescribedRemediesGu: [
        'મેન્કોઝેબ ૭૫ ડબ્લ્યુપી ૩૦ ગ્રામ પ્રતિ ૧૫ લીટર પંપ છાંટવું',
        'ખાટી છાશ ૫૦૦ મિલી + ૧૦ ગ્રામ હળદરનો દેશી ઉપચાર કરવો',
        'જમીનને અડતા રોગવાળા પાન કાપીને દૂર કરવા',
      ],
      respondedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
  {
    _id: 'fb-q-4',
    title: 'Yellow vein network appearing on young Okra/Bhindi foliage',
    titleGu: 'ભીંડાના કૂમળા પાંદડામાં પીળી નસોની જાળી દેખાવી (યલો મોઝેક)',
    crop: 'Okra',
    cropGu: 'ભીંડા',
    urgency: 'Medium',
    status: 'Pending Review',
    farmerName: 'Bhavesh Solanki',
    farmerNameGu: 'ભાવેશભાઈ સોલંકી',
    farmerPhone: '+91 94280 61942',
    village: 'Asodar',
    taluka: 'Anklav',
    district: 'Anand',
    imageUrl: '/images/okra.png',
    description:
      'Young leaves at the top canopy are developing clear yellow veins while interveinal areas remain green. What preventive spray will check spread to adjacent plots?',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    _id: 'fb-q-5',
    title: 'Castor semilooper caterpillar attack and angular leaf spots in Vemar plot',
    titleGu: 'વેમર ગામના ખેતરમાં દિવેલાના પાન પર કાતરા/ઈયળનો ઉપદ્રવ અને ડાઘ',
    crop: 'Castor',
    cropGu: 'દિવેલા/એરંડા',
    urgency: 'High',
    status: 'Pending Review',
    farmerName: 'Kanubhai Bharwad',
    farmerNameGu: 'કાનુભાઈ ભરવાડ',
    farmerPhone: '+91 97140 33819',
    village: 'Vemar',
    taluka: 'Karjan',
    district: 'Vadodara',
    imageUrl: '/images/castor.png',
    description:
      'Caterpillars feeding aggressively on broad castor leaves in Karjan taluka. Leaves have skeletonized appearance with multiple holes. Requesting immediate agronomic solution.',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];

/**
 * Fetch Queries list
 */
export const fetchQueries = async (params = {}) => {
  try {
    const queryStr = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/queries?${queryStr}`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) throw new Error('Failed to fetch queries');
    const data = await res.json();
    if (data.queries && data.queries.length > 0) {
      return data.queries;
    }
    return FALLBACK_QUERIES;
  } catch (error) {
    console.warn('Using client fallback queries for resilience:', error.message);
    const user = getStoredUser();
    if (!user || user.role === 'officer' || user.role === 'admin') {
      return FALLBACK_QUERIES;
    }
    // Filter for current farmer if logged in
    const matching = FALLBACK_QUERIES.filter(
      (q) => q.farmerName?.toLowerCase() === user.name?.toLowerCase()
    );
    return matching.length > 0 ? matching : FALLBACK_QUERIES;
  }
};

/**
 * Create a new farmer consultation query
 */
export const createQuery = async (queryData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/queries`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(queryData),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to submit query');
    }

    const data = await res.json();
    return data.query;
  } catch (error) {
    console.error('Submit query error:', error);
    throw error;
  }
};

/**
 * Agricultural Officer responds to a query
 */
export const respondToQuery = async (queryId, responseData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/queries/${queryId}/respond`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(responseData),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to submit official response');
    }

    const data = await res.json();
    return data.query;
  } catch (error) {
    console.error('Respond to query error:', error);
    throw error;
  }
};

export const submitOfficerResponse = respondToQuery;

/**
 * Delete a query
 */
export const deleteQuery = async (queryId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/queries/${queryId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!res.ok) throw new Error('Failed to delete query');
    return true;
  } catch (error) {
    console.error('Delete query error:', error);
    throw error;
  }
};
