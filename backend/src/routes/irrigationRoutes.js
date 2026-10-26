import express from 'express';
import IrrigationLog from '../models/IrrigationLog.js';

const router = express.Router();

// Crop irrigation coefficients (Kc) and baseline water demands in mm/day for Gujarat agro-climatic zone
const CROP_DATABASE = {
  cotton: {
    nameEn: 'Cotton (Kapas)',
    nameGu: 'કપાસ',
    baseWaterMmPerDay: 5.5,
    stages: {
      seedling: { labelEn: 'Seedling / Germination', labelGu: 'અંકુરણ અવસ્થા', kc: 0.45, depthCm: 30 },
      vegetative: { labelEn: 'Vegetative Growth', labelGu: 'વાનસ્પતિક વિકાસ', kc: 0.75, depthCm: 60 },
      flowering: { labelEn: 'Flowering & Square Formation', labelGu: 'ફૂલ અને જીંડવા અવસ્થા (ક્રિટિકલ)', kc: 1.15, depthCm: 90 },
      boll_development: { labelEn: 'Boll Development', labelGu: 'જીંડવા ભરાવ', kc: 0.95, depthCm: 90 },
      maturity: { labelEn: 'Boll Bursting & Maturity', labelGu: 'જીંડવા ખીલવા અને પાકવું', kc: 0.55, depthCm: 90 },
    },
    rootDepthMeters: 0.9,
    dripEmitterFlowLph: 4.0, // Liters per hour per dripper
  },
  banana: {
    nameEn: 'Banana (Keli - Padra Specialty)',
    nameGu: 'કેળ (પાદરા સ્પેશ્યલ)',
    baseWaterMmPerDay: 7.2,
    stages: {
      seedling: { labelEn: 'Transplanting / Young Sucker', labelGu: 'રોપણી / પીલા અવસ્થા', kc: 0.60, depthCm: 30 },
      vegetative: { labelEn: 'Active Foliar Growth', labelGu: 'વાનસ્પતિક પર્ણ વિકાસ', kc: 0.95, depthCm: 60 },
      shooting: { labelEn: 'Shooting & Flower Emergence', labelGu: 'કમળ / કેળનો ફાલ નીકળવો', kc: 1.25, depthCm: 75 },
      fruit_filling: { labelEn: 'Bunch Development', labelGu: 'લૂમ ભરાવ અને વિકાસ', kc: 1.10, depthCm: 75 },
      maturity: { labelEn: 'Harvest Maturity', labelGu: 'કાપણી અવસ્થા', kc: 0.80, depthCm: 75 },
    },
    rootDepthMeters: 0.75,
    dripEmitterFlowLph: 8.0,
  },
  tomato: {
    nameEn: 'Tomato (Tameta)',
    nameGu: 'ટામેટા',
    baseWaterMmPerDay: 4.8,
    stages: {
      seedling: { labelEn: 'Nursery / Transplanting', labelGu: 'રોપણી અવસ્થા', kc: 0.50, depthCm: 25 },
      vegetative: { labelEn: 'Vegetative Branching', labelGu: 'શાખાઓનો વિકાસ', kc: 0.80, depthCm: 45 },
      flowering: { labelEn: 'Flowering & Fruit Set', labelGu: 'ફૂલ અને ફળ બેસવા', kc: 1.15, depthCm: 60 },
      fruit_ripening: { labelEn: 'Fruit Ripening', labelGu: 'ફળ પાકવું', kc: 0.85, depthCm: 60 },
    },
    rootDepthMeters: 0.6,
    dripEmitterFlowLph: 2.5,
  },
  tuver: {
    nameEn: 'Pigeon Pea (Tuver)',
    nameGu: 'તુવેર / અરહર',
    baseWaterMmPerDay: 4.2,
    stages: {
      seedling: { labelEn: 'Early Vegetative', labelGu: 'પ્રારંભિક વિકાસ', kc: 0.40, depthCm: 30 },
      branching: { labelEn: 'Canopy Branching', labelGu: 'ડાળીઓનો ફેલાવો', kc: 0.70, depthCm: 60 },
      flowering: { labelEn: 'Flowering / Pod Setting', labelGu: 'ફૂલ અને શીંગો બેસવી', kc: 1.10, depthCm: 90 },
      pod_filling: { labelEn: 'Grain Filling', labelGu: 'દાણા ભરાવ', kc: 0.80, depthCm: 90 },
    },
    rootDepthMeters: 0.9,
    dripEmitterFlowLph: 3.0,
  },
  wheat: {
    nameEn: 'Wheat (Ghau)',
    nameGu: 'ઘઉં',
    baseWaterMmPerDay: 4.5,
    stages: {
      crown_root: { labelEn: 'Crown Root Initiation (CRI)', labelGu: 'મુકુટ મૂળ અવસ્થા (૨૧ દિવસ)', kc: 0.50, depthCm: 25 },
      tillering: { labelEn: 'Tillering & Jointing', labelGu: 'ફૂટ અને ગાંઠ અવસ્થા', kc: 0.85, depthCm: 50 },
      heading: { labelEn: 'Flowering & Heading', labelGu: 'ડૂંડી અને ફૂલ અવસ્થા', kc: 1.15, depthCm: 70 },
      milking: { labelEn: 'Milk & Dough Stage', labelGu: 'દૂધિયા અને દાણા ભરાવ', kc: 0.90, depthCm: 70 },
    },
    rootDepthMeters: 0.7,
    dripEmitterFlowLph: 2.0,
  },
  castor: {
    nameEn: 'Castor (Divela)',
    nameGu: 'દિવેલા / એરંડા',
    baseWaterMmPerDay: 4.6,
    stages: {
      seedling: { labelEn: 'Early Growth', labelGu: 'પ્રારંભિક વિકાસ', kc: 0.45, depthCm: 35 },
      spike_initiation: { labelEn: 'Spike Emergence', labelGu: 'માળ નીકળવી', kc: 0.85, depthCm: 70 },
      capsule_development: { labelEn: 'Capsule Development', labelGu: 'ડોડા ભરાવ', kc: 1.05, depthCm: 90 },
      maturity: { labelEn: 'Maturity', labelGu: 'પાકટ અવસ્થા', kc: 0.65, depthCm: 90 },
    },
    rootDepthMeters: 0.9,
    dripEmitterFlowLph: 3.5,
  },
};

// Soil Characteristics in Vadodara District
const SOIL_TYPES = {
  goradu: {
    nameEn: 'Goradu / Sandy Loam (Vadodara & Anand)',
    nameGu: 'ગોરાડુ / રેતાળ કાંપવાળી જમીન',
    infiltrationRateMmHr: 22,
    waterHoldingCapacityPercent: 18,
    runFrequencyDays: 2,
  },
  medium_black: {
    nameEn: 'Medium Black Soil (Karjan & Padra)',
    nameGu: 'મધ્યમ કાળી જમીન (પાદરા - કરજણ કપાસ પટ્ટો)',
    infiltrationRateMmHr: 12,
    waterHoldingCapacityPercent: 28,
    runFrequencyDays: 3,
  },
  heavy_clay: {
    nameEn: 'Heavy Black Clay (Bhal & River Basin)',
    nameGu: 'ભાલ અને કાનમ કાળી ચીકણી જમીન',
    infiltrationRateMmHr: 6,
    waterHoldingCapacityPercent: 36,
    runFrequencyDays: 4,
  },
};

// Irrigation Methods
const IRRIGATION_METHODS = {
  drip: {
    nameEn: 'Drip Irrigation (Micro-Drip)',
    nameGu: 'ટપક સિંચાઈ પદ્ધતિ (ડ્રીપ)',
    efficiency: 0.90, // 90% water directly reaches root zone
    emissionRateMmHr: 8.0,
    pumpEnergyKwhPer10kL: 2.2,
  },
  sprinkler: {
    nameEn: 'Micro Sprinkler System',
    nameGu: 'ફુવારા પદ્ધતિ (સ્પ્રિંકલર)',
    efficiency: 0.75, // 75% efficiency
    emissionRateMmHr: 14.0,
    pumpEnergyKwhPer10kL: 3.5,
  },
  flood: {
    nameEn: 'Furrow / Flood Irrigation (Traditional)',
    nameGu: 'પરંપરાગત ધોરિયા પદ્ધતિ',
    efficiency: 0.48, // 48% efficiency due to runoff and deep percolation
    emissionRateMmHr: 25.0,
    pumpEnergyKwhPer10kL: 5.8,
  },
};

// In-memory Session Logs (Persisted during app run, backed up by sample history)
let irrigationLogs = [
  {
    id: 'log-01',
    cropKey: 'cotton',
    cropName: 'Cotton (Kapas)',
    areaVigha: 2.5,
    method: 'drip',
    durationMinutes: 105,
    waterDeliveredLiters: 14700,
    waterSavedLiters: 16800,
    timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    status: 'Completed',
  },
  {
    id: 'log-02',
    cropKey: 'banana',
    cropName: 'Banana (Keli)',
    areaVigha: 1.5,
    method: 'drip',
    durationMinutes: 90,
    waterDeliveredLiters: 18200,
    waterSavedLiters: 19500,
    timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    status: 'Completed',
  },
];

/**
 * GET /api/irrigation/calculate
 * Calculate precision runtime, required liters, and savings
 */
router.get('/calculate', (req, res) => {
  try {
    const cropKey = req.query.crop || 'cotton';
    const stageKey = req.query.stage || 'flowering';
    const soilKey = req.query.soil || 'medium_black';
    const methodKey = req.query.method || 'drip';
    const area = parseFloat(req.query.area) || 2.0;
    const areaUnit = req.query.unit || 'vigha'; // 'vigha' | 'acre'
    const moisture = req.query.moisture || 'moderate'; // 'dry' | 'moderate' | 'wet'

    const crop = CROP_DATABASE[cropKey] || CROP_DATABASE.cotton;
    const stage = crop.stages[stageKey] || Object.values(crop.stages)[0];
    const soil = SOIL_TYPES[soilKey] || SOIL_TYPES.medium_black;
    const method = IRRIGATION_METHODS[methodKey] || IRRIGATION_METHODS.drip;

    // Convert area to square meters (1 Gujarat Vigha ≈ 17,424 sq ft ≈ 1618.7 m²; 1 Acre ≈ 4046.86 m²)
    const areaSqMeters = areaUnit === 'acre' ? area * 4046.86 : area * 1618.74;

    // Evapotranspiration baseline for Vadodara in hot / post-monsoon period
    const ET0 = 5.2; // mm/day
    const ETc = ET0 * stage.kc; // Crop water demand in mm/day

    // Soil moisture depletion factor
    let moistureFactor = 1.0;
    if (moisture === 'dry') moistureFactor = 1.35; // Needs catchup replenishment
    if (moisture === 'wet') moistureFactor = 0.40; // Needs light maintenance only

    // Net irrigation requirement in mm
    const netWaterMm = ETc * moistureFactor;

    // Gross water requirement taking irrigation application efficiency into account
    const grossWaterMm = netWaterMm / method.efficiency;

    // Total water volume in liters: 1 mm depth over 1 sq meter = 1 liter
    const totalWaterLiters = Math.round(grossWaterMm * areaSqMeters);

    // Baseline flood volume to calculate water conservation
    const floodEfficiency = IRRIGATION_METHODS.flood.efficiency;
    const floodGrossWaterMm = netWaterMm / floodEfficiency;
    const floodWaterLiters = Math.round(floodGrossWaterMm * areaSqMeters);
    const waterSavedLiters = Math.max(0, floodWaterLiters - totalWaterLiters);

    // Calculate runtime based on method discharge rate
    // E.g., Drip application delivers ~8 mm/hr equivalent
    let runtimeHours = grossWaterMm / method.emissionRateMmHr;
    if (methodKey === 'drip') {
      // Drip lines typical run: 1 to 2.5 hours per shift
      runtimeHours = Math.max(0.75, Math.min(3.5, runtimeHours));
    } else if (methodKey === 'sprinkler') {
      runtimeHours = Math.max(0.5, Math.min(2.5, runtimeHours));
    } else {
      runtimeHours = Math.max(1.5, Math.min(5.0, runtimeHours));
    }

    const totalMinutes = Math.round(runtimeHours * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    // Energy and cost savings
    const electricityUnitsSaved = Math.round((waterSavedLiters / 10000) * 3.6);
    const powerBillSavingsInr = Math.round(electricityUnitsSaved * 4.8); // ₹4.80/unit agricultural tariff

    res.json({
      success: true,
      calculation: {
        cropKey,
        cropName: crop.nameEn,
        cropNameGu: crop.nameGu,
        stageKey,
        stageName: stage.labelEn,
        stageNameGu: stage.labelGu,
        soilName: soil.nameEn,
        soilNameGu: soil.nameGu,
        methodName: method.nameEn,
        methodNameGu: method.nameGu,
        area,
        areaUnit,
        areaSqMeters: Math.round(areaSqMeters),
        runtime: {
          totalMinutes,
          hours,
          minutes,
          formatted: `${hours}h ${minutes}m`,
          formattedGu: `${hours} કલાક ${minutes} મિનિટ`,
        },
        waterMetrics: {
          totalLiters: totalWaterLiters,
          waterSavedLiters,
          floodEquivalentLiters: floodWaterLiters,
          savingsPercent: Math.round(((floodWaterLiters - totalWaterLiters) / floodWaterLiters) * 100),
        },
        energyMetrics: {
          unitsSavedKwh: electricityUnitsSaved,
          billSavingsInr: powerBillSavingsInr,
        },
        flowRateLpm: Math.round(totalWaterLiters / totalMinutes), // Liters per minute flow rate
        rootDepthCm: stage.depthCm,
        recommendedIntervalDays: soil.runFrequencyDays,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/irrigation/power-schedule
 * MGVCL 3-Phase Agricultural Electricity Shift Schedule for Vadodara District
 */
router.get('/power-schedule', (req, res) => {
  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();
  const currentTimeDec = currentHour + currentMinute / 60;

  // Gujarat Jyotigram Agricultural 8-Hour Power Supply Shifts (Roster rotates weekly)
  const shifts = [
    {
      id: 'shift-morning',
      labelEn: 'Day Shift (Group A)',
      labelGu: 'દિવસ શિફ્ટ (ગ્રૂપ A)',
      startHour: 6,
      endHour: 14,
      timeSpan: '06:00 AM - 02:00 PM',
      talukas: ['Padra', 'Karjan', 'Dabhoi'],
    },
    {
      id: 'shift-evening',
      labelEn: 'Afternoon Shift (Group B)',
      labelGu: 'બપોર શિફ્ટ (ગ્રૂપ B)',
      startHour: 14,
      endHour: 22,
      timeSpan: '02:00 PM - 10:00 PM',
      talukas: ['Vadodara Rural', 'Savli', 'Waghodia'],
    },
    {
      id: 'shift-night',
      labelEn: 'Night Shift (Group C)',
      labelGu: 'રાત્રિ શિફ્ટ (ગ્રૂપ C)',
      startHour: 22,
      endHour: 6, // Next day 06:00 AM
      timeSpan: '10:00 PM - 06:00 AM',
      talukas: ['Shinor', 'Anklav Border'],
    },
  ];

  // Determine active shift
  let activeShift = shifts[0];
  if (currentTimeDec >= 6 && currentTimeDec < 14) {
    activeShift = shifts[0];
  } else if (currentTimeDec >= 14 && currentTimeDec < 22) {
    activeShift = shifts[1];
  } else {
    activeShift = shifts[2];
  }

  res.json({
    success: true,
    discom: 'MGVCL (Madhya Gujarat Vij Company Ltd)',
    feederType: 'Agri-Jyotigram 3-Phase 415V',
    currentTime: `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`,
    activeShift,
    allShifts: shifts,
    voltageStatus: 'Normal (410V - 425V balanced)',
    recommendationEn: 'Operate submersed borewell pumps during active 3-phase window to avoid phase drop tripping.',
    recommendationGu: 'સબમર્સિબલ પંપ માત્ર 3-ફેઝ વીજળી ઉપલબ્ધ હોય ત્યારે જ ચલાવો જેથી મોટર બળી જતી અટકાવી શકાય.',
  });
});

/**
 * GET /api/irrigation/weather-advisory
 * Real-time ET0 & Rain-Skip Advisory for Vadodara
 */
router.get('/weather-advisory', (req, res) => {
  // Typical Vadodara agro-climatic conditions
  const weatherAdvisory = {
    location: 'Vadodara District, Gujarat',
    coordinates: { lat: 22.3072, lng: 73.1812 },
    ambientTempC: 34.2,
    relativeHumidityPercent: 58,
    windSpeedKmh: 11.4,
    rainProbabilityPercent: 12,
    forecastNext24h: 'Clear and dry skies with moderate afternoon solar irradiance.',
    forecastNext24hGu: 'આકાશ ચોખ્ખું રહેશે અને બપોરે તડકો રહેશે. વરસાદની કોઈ શક્યતા નથી.',
    skipIrrigation: false,
    reasonEn: 'Rain probability is low (<20%). Proceed with calculated precision watering.',
    reasonGu: 'વરસાદની શક્યતા ઓછી છે. આયોજિત ટપક સિંચાઈ ચાલુ રાખો.',
    evapotranspirationRateMm: 5.2,
    bestWateringWindow: 'Early Morning (06:30 AM - 09:30 AM) or Late Evening (05:00 PM - 07:00 PM)',
    bestWateringWindowGu: 'સવારે (૦૬:૩૦ થી ૦૯:૩૦) અથવા સાંજે (૦૫:૦૦ થી ૦૭:૦૦) પાણી આપવું શ્રેષ્ઠ છે.',
  };

  res.json({
    success: true,
    data: weatherAdvisory,
  });
});

/**
 * GET /api/irrigation/metadata
 * Return all selectable crops, soils, and methods
 */
router.get('/metadata', (req, res) => {
  res.json({
    success: true,
    crops: Object.entries(CROP_DATABASE).map(([key, val]) => ({
      key,
      nameEn: val.nameEn,
      nameGu: val.nameGu,
      stages: Object.entries(val.stages).map(([sKey, sVal]) => ({
        key: sKey,
        labelEn: sVal.labelEn,
        labelGu: sVal.labelGu,
      })),
    })),
    soils: Object.entries(SOIL_TYPES).map(([key, val]) => ({
      key,
      nameEn: val.nameEn,
      nameGu: val.nameGu,
    })),
    methods: Object.entries(IRRIGATION_METHODS).map(([key, val]) => ({
      key,
      nameEn: val.nameEn,
      nameGu: val.nameGu,
      efficiencyPercent: Math.round(val.efficiency * 100),
    })),
  });
});

/**
 * GET /api/irrigation/logs
 * Retrieve recent farmer irrigation sessions from MongoDB Atlas
 */
router.get('/logs', async (req, res) => {
  try {
    const dbLogs = await IrrigationLog.find().sort({ createdAt: -1 }).limit(15);
    if (dbLogs && dbLogs.length > 0) {
      return res.json({
        success: true,
        source: 'MongoDB Atlas',
        data: dbLogs,
      });
    }
  } catch (err) {
    console.warn('MongoDB fetch fallback for irrigation logs:', err.message);
  }

  res.json({
    success: true,
    source: 'local_cache',
    data: irrigationLogs,
  });
});

/**
 * POST /api/irrigation/logs
 * Save a newly completed irrigation session to MongoDB Atlas
 */
router.post('/logs', async (req, res) => {
  try {
    const { cropKey, cropName, areaVigha, method, durationMinutes, waterDeliveredLiters, waterSavedLiters, taluka } = req.body;
    const logData = {
      cropKey: cropKey || 'cotton',
      cropName: cropName || 'Cotton',
      areaVigha: parseFloat(areaVigha) || 1.0,
      method: method || 'drip',
      durationMinutes: parseInt(durationMinutes, 10) || 60,
      waterDeliveredLiters: parseInt(waterDeliveredLiters, 10) || 10000,
      waterSavedLiters: parseInt(waterSavedLiters, 10) || 12000,
      taluka: taluka || 'Padra',
      status: 'Completed',
    };

    // Save to MongoDB Atlas
    let savedLog = null;
    try {
      savedLog = await IrrigationLog.create(logData);
    } catch (dbErr) {
      console.warn('MongoDB save fallback for irrigation log:', dbErr.message);
    }

    const fallbackLog = {
      id: savedLog?._id || `log-${Date.now()}`,
      ...logData,
      timestamp: new Date().toISOString(),
    };

    irrigationLogs.unshift(fallbackLog);
    if (irrigationLogs.length > 20) irrigationLogs.pop();

    res.status(201).json({
      success: true,
      source: savedLog ? 'MongoDB Atlas' : 'local_cache',
      log: savedLog || fallbackLog,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
