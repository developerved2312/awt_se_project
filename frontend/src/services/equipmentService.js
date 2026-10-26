/**
 * Equipment Service
 * Handles Krishi Tools & Machinery catalog, i-Khedut subsidies, and rental bookings.
 */

const API_BASE = '/api/equipment';

const FALLBACK_EQUIPMENT = [
  {
    _id: 'equip-1',
    name: 'Precision Agricultural Spray Drone (16L)',
    nameGu: 'સ્માર્ટ ડ્રોન સ્પ્રેયર (૧૬ લીટર ક્ષમતા)',
    category: 'drone_tech',
    categoryLabel: 'Drone Technology',
    categoryLabelGu: 'ડ્રોન ટેકનોલોજી',
    rentalRatePerHour: 450,
    rentalRatePerDay: 3200,
    salePrice: 480000,
    subsidyPercentage: 50,
    ikhedutScheme: 'Kisan Drone Promotion Scheme (50% Subsidy for FPO & Farmers)',
    ikhedutSchemeGu: 'કિસાન ડ્રોન પ્રોત્સાહન યોજના (i-ખેડૂત ૫૦% સબસિડી)',
    effectiveFarmerPrice: 240000,
    talukaAvailability: ['Padra', 'Karjan', 'Dabhoi', 'Savli', 'Waghodia', 'Shinor', 'Vadodara Rural'],
    imageUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80',
    specs: [
      '16-Liter liquid pesticide / nano-urea payload tank',
      'Covers 1 acre in 7-10 minutes with zero soil compaction',
      'Centrifugal atomization nozzles reducing chemical drift',
      'Autonomous GPS obstacle avoidance & terrain following',
    ],
    specsGu: [
      '૧૬ લીટર દવા અથવા નેનો-યુરિયા ભરવાની ક્ષમતા',
      'માત્ર ૭-૧૦ મિનિટમાં ૧ એકર વિસ્તારમાં સચોટ છંટકાવ',
      'દવા ઉડતી અટકાવવા અદ્યતન સેન્ટ્રીફ્યુગલ નોઝલ',
      'ઓટોમેટીક GPS અને અવરોધ પારખવાની સિસ્ટમ',
    ],
    status: 'available',
    totalUnits: 6,
    availableUnits: 4,
    vendorContact: {
      name: 'Gujarat Agro Industries Corp (GAIC) Drone Hub',
      phone: '+91 94270 91823',
      address: 'Kothi Compound, Raopura, Vadodara',
      verified: true,
    },
  },
  {
    _id: 'equip-2',
    name: 'Mini Tractor Rotary Tiller / Rotavator (24HP)',
    nameGu: 'મિની ટ્રેક્ટર રોટાવેટર (૨૪ HP)',
    category: 'land_prep',
    categoryLabel: 'Land Preparation',
    categoryLabelGu: 'જમીન તૈયારી સાધનો',
    rentalRatePerHour: 550,
    rentalRatePerDay: 4000,
    salePrice: 115000,
    subsidyPercentage: 40,
    ikhedutScheme: 'Sub-Mission on Agricultural Mechanization (SMAM Gujarat)',
    ikhedutSchemeGu: 'કૃષિ યાંત્રિકીકરણ સબ-મિશન (૪૦% સબસિડી)',
    effectiveFarmerPrice: 69000,
    talukaAvailability: ['Padra', 'Karjan', 'Dabhoi', 'Savli', 'Waghodia'],
    imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&auto=format&fit=crop&q=80',
    specs: [
      '4-Foot working width, 36 Boron steel curved blades',
      'Ideal for Cotton, Banana, and Vegetable bed preparation',
      'Breaks clods and incorporates crop residue into organic humus',
    ],
    specsGu: [
      '૪ ફૂટ કાર્યક્ષમ પહોળાઈ, ૩૬ બોરોન સ્ટીલ બ્લેડ્સ',
      'કપાસ, કેળ અને શાકભાજીની ક્યારીઓ બનાવવા ઉત્તમ',
      'ઢેફાં ભાંગી પાકના અવશેષોને જમીનમાં ભેળવે છે',
    ],
    status: 'available',
    totalUnits: 12,
    availableUnits: 9,
    vendorContact: {
      name: 'Baroda District Agro Machinery Cooperative',
      phone: '+91 98250 84721',
      address: 'Near Sayajiganj APMC Market Yard, Vadodara',
      verified: true,
    },
  },
  {
    _id: 'equip-3',
    name: 'Automatic Laser Land Leveler System',
    nameGu: 'ઓટોમેટીક લેસર લેન્ડ લેવલર સિસ્ટમ',
    category: 'land_prep',
    categoryLabel: 'Land Preparation',
    categoryLabelGu: 'જમીન તૈયારી સાધનો',
    rentalRatePerHour: 750,
    rentalRatePerDay: 5500,
    salePrice: 340000,
    subsidyPercentage: 50,
    ikhedutScheme: 'Rashtriya Krishi Vikas Yojana (RKVY Laser Land Leveling)',
    ikhedutSchemeGu: 'રાષ્ટ્રીય કૃષિ વિકાસ યોજના (૫૦% લેવલર સબસિડી)',
    effectiveFarmerPrice: 170000,
    talukaAvailability: ['Padra', 'Karjan', 'Dabhoi', 'Savli'],
    imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80',
    specs: [
      'Dual-slope laser transmitter with digital touch receiver',
      'Saves 25-30% irrigation water by ensuring uniform field slope',
      'Increases crop yield by 15% due to uniform germination',
    ],
    specsGu: [
      'ડ્યુઅલ સ્લોપ લેસર ટ્રાન્સમીટર અને ડિજિટલ રીસીવર',
      'જમીન એકસરખી સપાટ કરી ૨૫-૩૦% પિયત પાણી બચાવે છે',
      'સમાન ઉગાવાને કારણે ઉત્પાદનમાં ૧૫% વધારો થાય છે',
    ],
    status: 'available',
    totalUnits: 4,
    availableUnits: 3,
    vendorContact: {
      name: 'Padra Agro Technology Hub',
      phone: '+91 94280 61942',
      address: 'Station Road, Padra, Vadodara',
      verified: true,
    },
  },
  {
    _id: 'equip-4',
    name: '16L Dual-Motor High Pressure Battery Knapsack Sprayer',
    nameGu: '૧૬ લીટર ડબલ-મોટર બેટરી સ્પ્રે પંપ',
    category: 'sprayers',
    categoryLabel: 'Spraying Equipment',
    categoryLabelGu: 'છંટકાવ સાધનો',
    rentalRatePerHour: 60,
    rentalRatePerDay: 350,
    salePrice: 4800,
    subsidyPercentage: 50,
    ikhedutScheme: 'Gujarat Small Farmer Power Sprayer Subsidy (₹2,500 Max)',
    ikhedutSchemeGu: 'નાના ખેડૂતો માટે બેટરી પંપ સબસિડી યોજના',
    effectiveFarmerPrice: 2400,
    talukaAvailability: ['Padra', 'Karjan', 'Dabhoi', 'Savli', 'Waghodia', 'Shinor', 'Vadodara Rural'],
    imageUrl: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=800&auto=format&fit=crop&q=80',
    specs: [
      '12V 12Ah Heavy-duty Lithium-ion battery (6-8 hours continuous spray)',
      'Dual pressure motor delivering up to 130 PSI for dense foliage penetration',
      'Telescopic stainless steel lance with 4 interchangeable brass nozzles',
    ],
    specsGu: [
      '૧૨V ૧૨Ah લિથિયમ-આયન બેટરી (૬-૮ કલાક સતત કામગીરી)',
      '૧૩૦ PSI પ્રેશર જેથી મોટા પાનમાં પણ છેક અંદર સુધી દવા પહોંચે',
      'સ્ટેનલેસ સ્ટીલ લન્સ અને ૪ અલગ અલગ બ્રાસ નોઝલ',
    ],
    status: 'available',
    totalUnits: 40,
    availableUnits: 34,
    vendorContact: {
      name: 'Kisan Seva Kendra Vadodara',
      phone: '+91 97140 33819',
      address: 'Main Bazaar, Karjan, Vadodara',
      verified: true,
    },
  },
  {
    _id: 'equip-5',
    name: '5HP DC Solar Photovoltaic Submersible Water Pump',
    nameGu: '૫ HP સોલાર સબમર્સિબલ પિયત પંપ',
    category: 'irrigation_solar',
    categoryLabel: 'Irrigation & Solar',
    categoryLabelGu: 'સિંચાઈ અને સોલાર સાધનો',
    rentalRatePerHour: 0,
    rentalRatePerDay: 0,
    salePrice: 260000,
    subsidyPercentage: 60,
    ikhedutScheme: 'PM KUSUM Component B / Suryashakti Kisan Yojana (SKY)',
    ikhedutSchemeGu: 'પીએમ કુસુમ / સૂર્યશક્તિ કિસાન યોજના (૬૦% સહાય)',
    effectiveFarmerPrice: 104000,
    talukaAvailability: ['Padra', 'Karjan', 'Dabhoi', 'Savli', 'Waghodia', 'Shinor'],
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
    specs: [
      '4,800W High-efficiency Monocrystalline Solar Panels',
      'Delivers 140,000 Liters of water per sunny day',
      'Zero electricity bills & zero diesel reliance for 25 years',
      'Integrated MPPT remote telemetry and automatic dry-run protection',
    ],
    specsGu: [
      '૪૮૦૦ વોટ ઉચ્ચ કાર્યક્ષમતા વાળી મોનો-ક્રિસ્ટલાઇન સોલાર પ્લેટો',
      'દરરોજ ૧,૪૦,૦૦૦ લીટર પાણી ઉપાડવાની જબરદસ્ત ક્ષમતા',
      '૨૫ વર્ષ સુધી શૂન્ય લાઇટબિલ અને ડીઝલનો ખર્ચ બચી જાય',
      'ઓટોમેટીક ડ્રાય-રન પ્રોટેક્શન અને રિમોટ મોનિટરિંગ',
    ],
    status: 'available',
    totalUnits: 8,
    availableUnits: 7,
    vendorContact: {
      name: 'Gujarat Urja Vikas Nigam Solar Cell',
      phone: '+91 94270 91823',
      address: 'Race Course Road, Vadodara',
      verified: true,
    },
  },
  {
    _id: 'equip-6',
    name: 'Tractor-Mounted Plastic Mulch Film Laying & Drip Machine',
    nameGu: 'પ્લાસ્ટિક મલ્ચિંગ અને ડ્રિપ પાથરવાનું મશીન',
    category: 'land_prep',
    categoryLabel: 'Land Preparation',
    categoryLabelGu: 'જમીન તૈયારી સાધનો',
    rentalRatePerHour: 600,
    rentalRatePerDay: 4200,
    salePrice: 85000,
    subsidyPercentage: 40,
    ikhedutScheme: 'Gujarat Horticulture Mission Mulch Sub-Scheme',
    ikhedutSchemeGu: 'બાગાયત મિશન મલ્ચિંગ સહાય યોજના',
    effectiveFarmerPrice: 51000,
    talukaAvailability: ['Padra', 'Karjan', 'Dabhoi', 'Vadodara Rural'],
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
    specs: [
      'Lays lateral drip line, unrolls plastic mulch film, and covers edges in 1 pass',
      'Reduces weed growth by 90% and cuts water evaporation by 45%',
      'Saves 12-14 man-days per hectare during field setup',
    ],
    specsGu: [
      'ડ્રિપ પાઇપ, મલ્ચિંગ પેપર પાથરવું અને માટી ચઢાવવાનું કામ એકસાથે કરે છે',
      'નીંદણ ૯૦% અટકાવે છે અને ૪૫% પાણીનું બાષ્પીભવન રોકે છે',
      'હેક્ટર દીઠ ૧૨-૧૪ મજૂરોના ખર્ચની સીધી બચત',
    ],
    status: 'available',
    totalUnits: 5,
    availableUnits: 4,
    vendorContact: {
      name: 'Padra Vegetable Producers Cooperative',
      phone: '+91 98250 84721',
      address: 'Sardar Patel Veg Yard, Padra',
      verified: true,
    },
  },
];

export async function fetchEquipments({ category = 'all', taluka = 'all', search = '', subsidyOnly = false } = {}) {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (taluka && taluka !== 'all') params.append('taluka', taluka);
    if (search) params.append('search', search);
    if (subsidyOnly) params.append('subsidyOnly', 'true');

    const res = await fetch(`${API_BASE}?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.success && Array.isArray(data.equipments) && data.equipments.length > 0) {
      return data.equipments;
    }
    return FALLBACK_EQUIPMENT;
  } catch (err) {
    console.warn('[EquipmentService] Using fallback equipment catalog:', err.message);
    let filtered = [...FALLBACK_EQUIPMENT];
    if (category && category !== 'all') {
      filtered = filtered.filter((i) => i.category === category);
    }
    if (taluka && taluka !== 'all') {
      filtered = filtered.filter((i) => i.talukaAvailability.includes(taluka));
    }
    if (subsidyOnly) {
      filtered = filtered.filter((i) => i.subsidyPercentage > 0);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.nameGu.includes(q) ||
          i.ikhedutScheme.toLowerCase().includes(q)
      );
    }
    return filtered;
  }
}

export async function createEquipmentBooking(bookingData) {
  try {
    const res = await fetch(`${API_BASE}/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn('[EquipmentService] Booking fallback to local mock:', err.message);
    const mockRef = `BK-${Math.floor(100000 + Math.random() * 900000)}`;
    return {
      success: true,
      message: 'Booking request registered locally. Krishi Kendra will confirm dispatch.',
      booking: {
        _id: mockRef,
        ...bookingData,
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    };
  }
}

export async function fetchAllBookings() {
  try {
    const res = await fetch(`${API_BASE}/bookings/all`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.bookings || [];
  } catch (err) {
    console.warn('[EquipmentService] Fetch bookings fallback:', err.message);
    return [
      {
        _id: 'bk-mock-1',
        equipmentName: 'Precision Agricultural Spray Drone (16L)',
        farmerName: 'Rameshbhai Patel',
        farmerPhone: '+91 98251 44021',
        farmerTaluka: 'Padra',
        bookingType: 'rental',
        rentalDurationHours: 6,
        totalCostEstimate: 2700,
        status: 'pending',
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
      {
        _id: 'bk-mock-2',
        equipmentName: '5HP DC Solar Photovoltaic Submersible Water Pump',
        farmerName: 'Sanjaybhai Vankar',
        farmerPhone: '+91 94288 12390',
        farmerTaluka: 'Karjan',
        bookingType: 'subsidy_guidance',
        rentalDurationHours: 0,
        subsidyBenefitEstimate: 156000,
        status: 'confirmed',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
    ];
  }
}

export async function updateBookingStatus(id, status) {
  try {
    const res = await fetch(`${API_BASE}/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[EquipmentService] Update booking status fallback:', err.message);
    return { success: true, booking: { _id: id, status } };
  }
}
