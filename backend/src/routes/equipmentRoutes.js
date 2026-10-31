import express from 'express';
import mongoose from 'mongoose';
import Equipment from '../models/Equipment.js';
import EquipmentBooking from '../models/EquipmentBooking.js';

const router = express.Router();

// Initial authentic catalog of Gujarat regional implements with i-Khedut subsidies
const DEFAULT_EQUIPMENT_SEED = [
  {
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
    imageUrl: '/images/spray-drone.jpg',
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
    imageUrl: '/images/tractor-rotavator.jpg',
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
    imageUrl: '/images/laser-leveler.jpg',
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
    imageUrl: '/images/battery-sprayer.jpg',
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
    imageUrl: '/images/solar-pump.jpg',
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
    imageUrl: '/images/mulch-machine.jpg',
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

// Helper to seed catalog and initial bookings if empty
async function ensureSeedCatalog() {
  try {
    const count = await Equipment.countDocuments();
    if (count === 0) {
      console.log('[Equipment] Catalog is empty. Seeding initial regional machinery...');
      await Equipment.insertMany(DEFAULT_EQUIPMENT_SEED);
      console.log('[Equipment] Seeded 6 regional equipment records with i-Khedut subsidies.');
    }

    const bookingCount = await EquipmentBooking.countDocuments();
    if (bookingCount === 0) {
      console.log('[Equipment] Booking registry is empty. Seeding initial farmer bookings...');
      const allEquips = await Equipment.find().limit(5);
      const droneEquip = allEquips.find((e) => e.category === 'drone_tech') || allEquips[0];
      const tillerEquip = allEquips.find((e) => e.category === 'land_prep') || allEquips[1] || allEquips[0];
      const pumpEquip = allEquips.find((e) => e.category === 'solar_pumping') || allEquips[2] || allEquips[0];

      const seedBookings = [
        {
          equipmentId: droneEquip?._id,
          equipmentName: droneEquip?.name || 'Precision Agricultural Spray Drone (16L)',
          farmerName: 'Rameshbhai Patel',
          farmerPhone: '+91 98251 44021',
          farmerTaluka: 'Padra',
          farmerVillage: 'Chokari',
          bookingType: 'rental',
          rentalDurationHours: 6,
          startDate: new Date(Date.now() - 3600000 * 4),
          totalCostEstimate: 2700,
          subsidyBenefitEstimate: 0,
          status: 'pending',
          notes: 'Emergency foliar spray needed for 8 acres cotton plot against whitefly infestation.',
        },
        {
          equipmentId: pumpEquip?._id,
          equipmentName: pumpEquip?.name || '5HP DC Solar Photovoltaic Submersible Water Pump',
          farmerName: 'Bhaveshbhai Solanki',
          farmerPhone: '+91 94288 12390',
          farmerTaluka: 'Karjan',
          farmerVillage: 'Kandari',
          bookingType: 'subsidy_guidance',
          rentalDurationHours: 0,
          startDate: new Date(Date.now() - 3600000 * 24),
          totalCostEstimate: 0,
          subsidyBenefitEstimate: 156000,
          status: 'confirmed',
          notes: 'i-Khedut application verification and borehole site inspection scheduled.',
        },
        {
          equipmentId: tillerEquip?._id,
          equipmentName: tillerEquip?.name || 'Mini Tractor Rotary Tiller / Rotavator (24HP)',
          farmerName: 'Kanubhai Bharwad',
          farmerPhone: '+91 97245 67812',
          farmerTaluka: 'Dabhoi',
          farmerVillage: 'Vaghodia Road Hub',
          bookingType: 'rental',
          rentalDurationHours: 8,
          startDate: new Date(Date.now() - 3600000 * 48),
          totalCostEstimate: 4400,
          subsidyBenefitEstimate: 0,
          status: 'confirmed',
          notes: 'Seed bed preparation for upcoming Rabi wheat and pigeon pea planting.',
        },
        {
          equipmentId: allEquips[0]?._id,
          equipmentName: 'Combine Harvester Custom Rental (Special Request)',
          farmerName: 'Govindbhai Parmar',
          farmerPhone: '+91 99092 34156',
          farmerTaluka: 'Savli',
          farmerVillage: 'Manjusar',
          bookingType: 'custom_request',
          rentalDurationHours: 12,
          startDate: new Date(Date.now() + 3600000 * 24),
          totalCostEstimate: 9600,
          subsidyBenefitEstimate: 0,
          status: 'pending',
          notes: 'Requesting custom combine harvester with straw reaper for 15 acres paddy field.',
        },
      ];

      await EquipmentBooking.insertMany(seedBookings);
      console.log(`[Equipment] Seeded ${seedBookings.length} initial equipment bookings in MongoDB Atlas.`);
    }
  } catch (err) {
    console.warn('[Equipment] Seed check error:', err.message);
  }
}

// 1. GET /api/equipment - List all equipment with search and filter
router.get('/', async (req, res) => {
  try {
    await ensureSeedCatalog();

    const { category, taluka, search, subsidyOnly } = req.query;
    const filter = {};

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (taluka && taluka !== 'all') {
      filter.talukaAvailability = { $in: [taluka] };
    }

    if (subsidyOnly === 'true') {
      filter.subsidyPercentage = { $gt: 0 };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { nameGu: { $regex: search, $options: 'i' } },
        { ikhedutScheme: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await Equipment.find(filter).sort({ createdAt: -1 });
    const totalCount = await Equipment.countDocuments();

    return res.json({
      success: true,
      count: items.length,
      totalCount,
      equipments: items,
    });
  } catch (err) {
    console.error('Error fetching equipment list:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 2. GET /api/equipment/:id - Fetch single equipment details
router.get('/:id', async (req, res) => {
  try {
    const item = await Equipment.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Equipment not found' });
    }
    return res.json({ success: true, equipment: item });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 3. POST /api/equipment/book - Create rental booking, subsidy inquiry, or custom request
router.post('/book', async (req, res) => {
  try {
    const {
      equipmentId,
      equipmentName,
      farmerName,
      farmerPhone,
      farmerTaluka,
      farmerVillage,
      bookingType,
      rentalDurationHours,
      startDate,
      notes,
    } = req.body;

    if (!farmerName || !farmerPhone) {
      return res.status(400).json({
        success: false,
        error: 'Farmer name and contact phone number are required.',
      });
    }

    let resolvedEquip = null;
    let resolvedName = equipmentName || '';
    let ratePerHour = 0;
    let salePrice = 0;
    let subsidyPct = 0;

    if (equipmentId && mongoose.isValidObjectId(equipmentId)) {
      resolvedEquip = await Equipment.findById(equipmentId);
    }

    if (!resolvedEquip && equipmentName) {
      resolvedEquip = await Equipment.findOne({
        $or: [
          { name: { $regex: equipmentName, $options: 'i' } },
          { nameGu: { $regex: equipmentName, $options: 'i' } },
        ],
      });
    }

    if (resolvedEquip) {
      resolvedName = resolvedEquip.name;
      ratePerHour = resolvedEquip.rentalRatePerHour || 0;
      salePrice = resolvedEquip.salePrice || 0;
      subsidyPct = resolvedEquip.subsidyPercentage || 0;
    } else if (!resolvedName) {
      resolvedName = 'Custom Agricultural Machinery Request';
    }

    const hours = Number(rentalDurationHours) || 8;
    const totalCostEstimate = ratePerHour > 0 ? ratePerHour * hours : (hours * 500);
    const subsidyBenefitEstimate = salePrice > 0
      ? Math.round(salePrice * (subsidyPct / 100))
      : 0;

    const newBooking = new EquipmentBooking({
      equipmentId: resolvedEquip?._id || null,
      equipmentName: resolvedName,
      farmerName: farmerName.trim(),
      farmerPhone: farmerPhone.trim(),
      farmerTaluka: farmerTaluka || 'Padra',
      farmerVillage: farmerVillage || '',
      bookingType: bookingType || (resolvedEquip ? 'rental' : 'custom_request'),
      rentalDurationHours: hours,
      startDate: startDate ? new Date(startDate) : new Date(),
      totalCostEstimate,
      subsidyBenefitEstimate,
      status: 'pending',
      notes: notes || '',
    });

    await newBooking.save();

    return res.status(201).json({
      success: true,
      message: 'Booking request registered successfully in database. Krishi Kendra will confirm dispatch.',
      booking: newBooking,
    });
  } catch (err) {
    console.error('Error creating equipment booking:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 4. GET /api/equipment/bookings/all - Fetch all bookings
router.get('/bookings/all', async (req, res) => {
  try {
    await ensureSeedCatalog();
    const bookings = await EquipmentBooking.find().sort({ createdAt: -1 }).limit(100);
    return res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 5. POST /api/equipment - Admin create new equipment
router.post('/', async (req, res) => {
  try {
    const newEquip = new Equipment(req.body);
    await newEquip.save();
    return res.status(201).json({ success: true, equipment: newEquip });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// 6. PUT /api/equipment/:id - Admin update equipment
router.put('/:id', async (req, res) => {
  try {
    const updated = await Equipment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Equipment not found' });
    }
    return res.json({ success: true, equipment: updated });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// 7. DELETE /api/equipment/:id - Admin delete equipment
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Equipment.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Equipment not found' });
    }
    return res.json({ success: true, message: 'Equipment removed from catalog' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 8. PATCH /api/equipment/bookings/:id/status - Admin update booking status
router.patch('/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await EquipmentBooking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    return res.json({ success: true, booking });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
