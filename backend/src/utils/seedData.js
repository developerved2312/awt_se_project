import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Query from '../models/Query.js';
import Scan from '../models/Scan.js';

// Setup environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

export const seedDatabase = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error(
        'MONGODB_URI is not defined in environment variables. Please configure MONGODB_URI in backend/.env'
      );
    }
    console.log('🌱 [Seeder] Connecting to MongoDB Atlas via environment config...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ [Seeder] Connected successfully to haritayan_db.');

    // 1. Clear existing seed users and their queries/scans to allow clean re-runs
    const seedEmails = [
      'ramesh.patel@haritayan.in',
      'bhavesh.solanki@haritayan.in',
      'kanubhai.bharwad@haritayan.in',
      'dr.hitesh.agri@haritayan.in',
    ];

    console.log('🧹 [Seeder] Refreshing existing mock accounts and queries...');
    const existingUsers = await User.find({ email: { $in: seedEmails } });
    const existingUserIds = existingUsers.map((u) => u._id);

    if (existingUserIds.length > 0) {
      await Query.deleteMany({ farmerId: { $in: existingUserIds } });
      await Scan.deleteMany({ userId: { $in: existingUserIds } });
      await User.deleteMany({ _id: { $in: existingUserIds } });
    }

    // 2. Create the Agricultural Officer
    console.log('👨‍💼 [Seeder] Creating District Agricultural Officer...');
    const officer = await User.create({
      name: 'Dr. Hitesh Trivedi',
      nameGu: 'ડૉ. હિતેશ ત્રિવેદી',
      email: 'dr.hitesh.agri@haritayan.in',
      password: 'Officer@2026', // Will be hashed via pre('save') hook
      role: 'officer', // Strictly officer - NO ADMIN
      phone: '+91 94270 91823',
      district: 'Vadodara',
      districtGu: 'વડોદરા',
      taluka: 'Vadodara Urban',
      talukaGu: 'વડોદરા શહેર',
      village: 'Krishi Bhavan Compound',
      villageGu: 'કૃષિ ભવન સંકુલ',
      designation: 'Senior District Agricultural Officer',
      designationGu: 'વરિષ્ઠ જિલ્લા કૃષિ અધિકારી',
      department: 'Dept of Agriculture, Govt of Gujarat & Anand Agri Univ Extension',
      badgeNumber: 'GJ-VAD-AGRI-042',
      officeLocation: 'Room 204, Krishi Bhavan, Kothi Road, Vadodara - 390001',
    });

    // 3. Create 3 Authentic Gujarat Farmers
    console.log('🌾 [Seeder] Creating 3 Gujarat Farmer profiles...');

    // Farmer 1: Ramesh Patel - Cotton & Tur specialist in Padra, Vadodara
    const farmer1 = await User.create({
      name: 'Ramesh Patel',
      nameGu: 'રમેશભાઈ પટેલ',
      email: 'ramesh.patel@haritayan.in',
      password: 'Password@123',
      role: 'farmer',
      phone: '+91 98250 84721',
      district: 'Vadodara',
      districtGu: 'વડોદરા',
      taluka: 'Padra',
      talukaGu: 'પાદરા',
      village: 'Samiyala',
      villageGu: 'સામિયાલા',
      farmSizeAcres: 6.5,
      primaryCrops: ['Cotton (કપાસ)', 'Pigeon Pea (તુવેર)'],
      primaryCropsGu: ['કપાસ', 'તુવેર'],
    });

    // Farmer 2: Bhavesh Solanki - Vegetable & Tomato farmer in Anklav, Anand
    const farmer2 = await User.create({
      name: 'Bhavesh Solanki',
      nameGu: 'ભાવેશભાઈ સોલંકી',
      email: 'bhavesh.solanki@haritayan.in',
      password: 'Password@123',
      role: 'farmer',
      phone: '+91 94280 61942',
      district: 'Anand',
      districtGu: 'આણંદ',
      taluka: 'Anklav',
      talukaGu: 'આંકલાવ',
      village: 'Asodar',
      villageGu: 'અસોદર',
      farmSizeAcres: 4.2,
      primaryCrops: ['Tomato (ટામેટા)', 'Okra (ભીંડા)'],
      primaryCropsGu: ['ટામેટા', 'ભીંડા'],
    });

    // Farmer 3: Kanubhai Bharwad - Castor & Cash crop farmer in Karjan, Vadodara
    const farmer3 = await User.create({
      name: 'Kanubhai Bharwad',
      nameGu: 'કાનુભાઈ ભરવાડ',
      email: 'kanubhai.bharwad@haritayan.in',
      password: 'Password@123',
      role: 'farmer',
      phone: '+91 97140 33819',
      district: 'Vadodara',
      districtGu: 'વડોદરા',
      taluka: 'Karjan',
      talukaGu: 'કરજણ',
      village: 'Vemar',
      villageGu: 'વેમર',
      farmSizeAcres: 8.5,
      primaryCrops: ['Castor (દિવેલા)', 'Cotton (કપાસ)'],
      primaryCropsGu: ['દિવેલા/એરંડા', 'કપાસ'],
    });

    // 4. Seed Diagnostic Scans for each farmer
    console.log('📸 [Seeder] Storing initial plant diagnostic scans...');

    // Ramesh's Cotton Scan
    const scanRamesh = await Scan.create({
      cropName: 'Cotton',
      cropNameGu: 'કપાસ',
      diseaseName: 'Cotton Leaf Curl Virus (CLCuV)',
      diseaseNameGu: 'કપાસમાં પાન વળવાનો વાયરસ (કુકડવાહ)',
      pathogenType: 'Viral',
      severity: 'Severe',
      confidenceScore: 94.8,
      isPlant: true,
      symptoms: [
        'Upward cup-shaped rolling and curling of leaf margins',
        'Distinct thickening and enations of foliar veins on ventral surface',
        'Stunted internodal growth and flower bud shedding',
      ],
      symptomsGu: [
        'પાંદડાની કિનારીઓ ઉપરની તરફ વળીને વાટકા જેવી બને છે',
        'પાંદડાની નીચેની નસો અસામાન્ય રીતે જાડી અને ઉપસેલી દેખાય છે',
        'છોડનો વિકાસ અટકી જાય છે અને ફૂલ-ઝીંડવા ખરી પડે છે',
      ],
      organicRemedies: [
        'Spray cold-pressed Neem Seed Kernel Extract (5% NSKE) or Neem Oil 1500 ppm @ 35ml/15L pump',
        'Eradicate host weeds (Kankalo, Peela Kaner, Abutilon indicum) bordering the cotton perimeter',
        'Install yellow sticky traps @ 16 traps per acre to capture whitefly vectors',
      ],
      organicRemediesGu: [
        'લીંબોળીનું તેલ (૧૫૦૦ પીપીએમ) અથવા નીમ અર્ક ૫% ૩૫ મિલી પ્રતિ પંપ છંટકાવ કરવો',
        'શેઢા-પાળા પરથી સફેદ માખીના આશ્રય આપતા નીંદણનો તાત્કાલિક નાશ કરવો',
        'એકર દીઠ ૧૬ પીળા ચીકણા ટ્રેપ (યલો સ્ટીકી ટ્રેપ) ગોઠવવા',
      ],
      chemicalRemedies: [
        'Spray Flonicamid 50 WG @ 3.5g per 15-litre water pump',
        'Alternate with Diafenthiuron 50 WP @ 18g/15L pump to prevent vector insecticide resistance',
      ],
      chemicalRemediesGu: [
        'ફ્લોનિકામિડ ૫૦ ડબ્લ્યુજી ૩.૫ ગ્રામ પ્રતિ ૧૫ લીટર પાણીના પંપમાં છાંટવું',
        'ડાયફેન્થિયુરોન ૫૦ ડબ્લ્યુપી ૧૮ ગ્રામ પ્રતિ પંપ વારાફરતી વાપરવું',
      ],
      preventiveMeasures: [
        'Choose CLCuV resistant hybrid varieties (G.Cot.Hy-8 / 12)',
        'Maintain balanced nitrogen fertilization; avoid excessive urea during humid weather',
      ],
      preventiveMeasuresGu: [
        'વાયરસ સામે પ્રતિકારક હાઇબ્રિડ કપાસ બિયારણ વાવવું',
        'વધુ પડતા યુરિયા ખાતરનો ઉપયોગ ટાળવો',
      ],
      imageUrl: '/uploads/cotton.jpeg',
      engineUsed: 'gemini-3.8-flash',
      userId: farmer1._id,
      farmerName: farmer1.name,
      farmerLocation: `${farmer1.village}, ${farmer1.taluka}, ${farmer1.district}`,
      userNotes: '40-day crop in Samiyala plot showing sudden leaf curl after heavy overcast days.',
    });

    // Bhavesh's Tomato Scan
    const scanBhavesh = await Scan.create({
      cropName: 'Tomato',
      cropNameGu: 'ટામેટા',
      diseaseName: 'Early Blight (Alternaria solani)',
      diseaseNameGu: 'ટામેટાનો આગોતરો સુકારો (અર્લી બ્લાઇટ)',
      pathogenType: 'Fungal',
      severity: 'Moderate',
      confidenceScore: 92.4,
      isPlant: true,
      symptoms: [
        'Concentric target-board ring spots on older bottom leaves',
        'Chlorotic yellow halos surrounding dark brown necrotic lesions',
        'Progressive upward defoliation from ground-level canopy',
      ],
      symptomsGu: [
        'નીચલા જૂના પાન પર ગોળ ચક્રાકાર (ટાર્ગેટ-બોર્ડ) કથ્થાઈ ડાઘ',
        'ડાઘની આસપાસ પીળી કિનારી બની પાન પીળું પડી સુકાઈ જાય છે',
        'જમીન તરફના પાન ઝડપથી ખરી પડે છે',
      ],
      organicRemedies: [
        'Foliar spray of Trichoderma harzianum bio-fungicide @ 50g per 15L pump',
        'Apply fermented sour buttermilk (ખાટી છાશ) @ 500ml with 10g turmeric per pump',
        'Trim and safely bury diseased lower foliage to improve aeration',
      ],
      organicRemediesGu: [
        'ટ્રાઇકોડર્મા હાર્ઝિયાનમ જૈવિક ફૂગનાશક ૫૦ ગ્રામ પ્રતિ પંપ છાંટવું',
        'ખાટી છાશ ૫૦૦ મિલી + ૧૦ ગ્રામ હળદર પ્રતિ પંપ મેળવી છંટકાવ કરવો',
        'જમીન અડકતા રોગિષ્ઠ પાન કાપીને દૂર દાટી દેવા',
      ],
      chemicalRemedies: [
        'Spray Mancozeb 75% WP @ 30g per 15-litre water pump',
        'In severe blight conditions, apply Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 15ml/pump',
      ],
      chemicalRemediesGu: [
        'મેન્કોઝેબ ૭૫% ડબ્લ્યુપી ૩૦ ગ્રામ પ્રતિ પંપ છંટકાવ કરવો',
        'તીવ્ર રોગમાં એઝોક્સીસ્ટ્રોબિન + ડાયફેનોકોનાઝોલ ૧૫ મિલી પ્રતિ પંપ વાપરવું',
      ],
      preventiveMeasures: [
        'Avoid flood or overhead sprinkler splash directly on tomato foliage',
        'Mulch soil using crop residues or silver-black plastic mulch',
      ],
      preventiveMeasuresGu: [
        'છોડના પાંદડા પર સીધું પાણી છાંટવું નહીં; ટપક પદ્ધતિ ઉત્તમ છે',
        'પ્લાસ્ટિક મલ્ચિંગ અથવા ઘાસના આવરણથી જમીનને ઢાંકવી',
      ],
      imageUrl: '/uploads/tomato.jpg',
      engineUsed: 'gemini-3.8-flash',
      userId: farmer2._id,
      farmerName: farmer2.name,
      farmerLocation: `${farmer2.village}, ${farmer2.taluka}, ${farmer2.district}`,
      userNotes: 'Spotted after unseasonal dew showers in Asodar vegetable plot.',
    });

    // Kanubhai's Castor Scan
    const scanKanubhai = await Scan.create({
      cropName: 'Castor',
      cropNameGu: 'દિવેલા / એરંડા',
      diseaseName: 'Castor Semilooper & Bacterial Blight',
      diseaseNameGu: 'દિવેલામાં પાન ખાનારી કાતરા/ઈયળ અને જીવાણુ ડાઘ',
      pathogenType: 'Pest Infestation',
      severity: 'Moderate',
      confidenceScore: 89.6,
      isPlant: true,
      symptoms: [
        'Ragged feeding holes and defoliation along leaf veins',
        'Angular water-soaked leaf spots turning brown and brittle',
        'Reduced photosynthesis and photosynthetic area',
      ],
      symptomsGu: [
        'પાંદડાની નસો સિવાયનો વચ્ચેનો ભાગ ઈયળો ખાઈ જઈ કાણાં પાડે છે',
        'પાણી જેવા ભીના કથ્થાઈ ડાઘ પડી પાન બરડ બને છે',
        'છોડનો ખોરાક બનાવવાનો વિસ્તાર ઘટી જાય છે',
      ],
      organicRemedies: [
        'Spray Bacillus thuringiensis (Bt formulation) @ 25g/15L pump',
        'Install bird perches (T-shaped bamboo poles) @ 15/acre to encourage predatory birds',
        'Neem seed kernel extract 5% to deter feeding',
      ],
      organicRemediesGu: [
        'બીટી (Bacillus thuringiensis) પાવડર ૨૫ ગ્રામ પ્રતિ પંપ છાંટવું',
        'ખેતરમાં પક્ષીઓને બેસવા માટે એકરે ૧૫ ‘ટી’ આકારના વાંસના ટેકા ખોડવા',
        'નીંબોળીનું અર્ક ૫% નો છંટકાવ કરવો',
      ],
      chemicalRemedies: [
        'Spray Chlorantraniliprole 18.5 SC @ 3ml per 15L water pump for chewing larvae',
        'Copper Oxychloride 50 WP @ 30g/pump for bacterial spot control',
      ],
      chemicalRemediesGu: [
        'ક્લોરાન્ટ્રાનિલીપ્રોલ ૧૮.૫ એસસી ૩ મિલી પ્રતિ પંપ છાંટવું',
        'કોપર ઓક્સીક્લોરાઇડ ૫૦ ડબ્લ્યુપી ૩૦ ગ્રામ પ્રતિ પંપ વાપરવું',
      ],
      preventiveMeasures: [
        'Hand-collect gregarious early-instar caterpillars in morning hours',
        'Deep summer ploughing to expose pupae in soil',
      ],
      preventiveMeasuresGu: [
        'સવારે ઈયળોના સમૂહવાળા પાન હાથથી તોડી નાશ કરવો',
        'ઉનાળામાં ઊંડી ખેડ કરવી',
      ],
      imageUrl: '/uploads/castor.png',
      engineUsed: 'gemini-3.8-flash',
      userId: farmer3._id,
      farmerName: farmer3.name,
      farmerLocation: `${farmer3.village}, ${farmer3.taluka}, ${farmer3.district}`,
      userNotes: 'Karjan black soil tract. Larvae active on young flush.',
    });

    // 5. Seed Realistic Farmer Queries / Agronomist Consultations
    console.log('📝 [Seeder] Storing authentic Agronomist consultation queries...');

    // Query 1: Ramesh Patel -> Cotton leaf curl (Reviewed by Dr. Hitesh)
    await Query.create({
      title: 'Rapid leaf curling and vein swelling in 45-day Bt cotton plot',
      titleGu: '૪૫ દિવસના બીટી કપાસમાં પાન વળવા અને નસો ફૂલી જવાની ગંભીર સમસ્યા',
      description:
        'My Bt Cotton (hybrid) in Samiyala village has developed upward leaf curling with thick lower veins. Whitefly population seems high after the humid spell. Please advise emergency protocol.',
      descriptionGu:
        'સામિયાલા ગામમાં કપાસના પાનમાં ઉપરની બાજુ વાટકા જેવા વળાંક આવેલ છે અને નીચેની નસો ફૂલી ગયેલ છે. સફેદ માખી ખૂબ દેખાય છે, તાત્કાલિક માર્ગદર્શન આપશો.',
      crop: 'Cotton',
      cropGu: 'કપાસ',
      urgency: 'High',
      status: 'Reviewed',
      farmerId: farmer1._id,
      farmerName: farmer1.name,
      farmerNameGu: farmer1.nameGu,
      farmerPhone: farmer1.phone,
      village: farmer1.village,
      taluka: farmer1.taluka,
      district: farmer1.district,
      imageUrl: '/uploads/cotton.jpeg',
      scanId: scanRamesh._id,
      officerResponse: {
        officerId: officer._id,
        officerName: officer.name,
        officerBadge: officer.badgeNumber,
        designation: officer.designation,
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
        respondedAt: new Date(Date.now() - 3600000 * 24), // 1 day ago
      },
    });

    // Query 2: Ramesh Patel -> Pigeon Pea inquiry (Pending Review)
    await Query.create({
      title: 'Flower bud shedding and leaf webber inspection in Tur / Pigeon Pea',
      titleGu: 'તુવેરમાં ફૂલ કળીઓ ખરી પડવી અને પાન ગૂંથનારી ઈયળની તપાસ',
      description:
        'Tur crop planted along field borders is starting to flower. Minor webbing of leaves noticed. Need safe organic recommendation before heavy flowering commences.',
      descriptionGu:
        'તુવેરમાં ફૂલ બેસવાની શરૂઆત થઈ છે. પાન ભેગા કરીને અંદર ઝાળું બનાવતી નાની ઈયળો દેખાય છે. ફૂલ ખરી ન પડે તે માટે ઓર્ગેનિક ઉપાય જણાવો.',
      crop: 'Pigeon Pea',
      cropGu: 'તુવેર',
      urgency: 'Medium',
      status: 'Pending Review',
      farmerId: farmer1._id,
      farmerName: farmer1.name,
      farmerNameGu: farmer1.nameGu,
      farmerPhone: farmer1.phone,
      village: farmer1.village,
      taluka: farmer1.taluka,
      district: farmer1.district,
      imageUrl: '/uploads/pigeon_pea.jpg',
    });

    // Query 3: Bhavesh Solanki -> Tomato Early Blight (Reviewed by Dr. Hitesh)
    await Query.create({
      title: 'Brown circular bullseye spots on lower leaves of hybrid tomato',
      titleGu: 'હાઇબ્રિડ ટામેટાના નીચલા પાન પર ગોળ ચક્રાકાર કથ્થાઈ ટપકાં (સુકારો)',
      description:
        'Lower foliage in 3-acre tomato plot in Asodar showing dark brown concentric rings surrounded by yellow halos. Older leaves drying and dropping off.',
      descriptionGu:
        'અસોદર ગામમાં ટામેટાના પાક પર નીચલા પાન પર કથ્થાઈ રંગના ગોળ ચક્રાકાર ડાઘ પડી રહ્યા છે અને પાન પીળા પડી ખરી રહ્યા છે.',
      crop: 'Tomato',
      cropGu: 'ટામેટા',
      urgency: 'High',
      status: 'Reviewed',
      farmerId: farmer2._id,
      farmerName: farmer2.name,
      farmerNameGu: farmer2.nameGu,
      farmerPhone: farmer2.phone,
      village: farmer2.village,
      taluka: farmer2.taluka,
      district: farmer2.district,
      imageUrl: '/uploads/tomato.jpg',
      scanId: scanBhavesh._id,
      officerResponse: {
        officerId: officer._id,
        officerName: officer.name,
        officerBadge: officer.badgeNumber,
        designation: officer.designation,
        comment:
          'Diagnosis: Alternaria Early Blight fungus. Do not use furrow or flood irrigation in evenings. Prune infected bottom 6 inches of foliage and spray Mancozeb or Copper Oxychloride promptly.',
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
        respondedAt: new Date(Date.now() - 3600000 * 12), // 12 hours ago
      },
    });

    // Query 4: Bhavesh Solanki -> Okra Yellow Vein Mosaic (Pending Review)
    await Query.create({
      title: 'Yellow vein network appearing on young Okra/Bhindi foliage',
      titleGu: 'ભીંડાના કૂમળા પાંદડામાં પીળી નસોની જાળી દેખાવી (યલો મોઝેક)',
      description:
        'Young leaves at the top canopy are developing clear yellow veins while interveinal areas remain green. What preventive spray will check spread to adjacent plots?',
      descriptionGu:
        'ભીંડાના ટોચના નવા પાનમાં નસો પીળી પડી ગઈ છે. અન્ય ક્યારાઓમાં ફેલાતો અટકાવવા માટે ઉપાય જણાવશો.',
      crop: 'Okra',
      cropGu: 'ભીંડા',
      urgency: 'Medium',
      status: 'Pending Review',
      farmerId: farmer2._id,
      farmerName: farmer2.name,
      farmerNameGu: farmer2.nameGu,
      farmerPhone: farmer2.phone,
      village: farmer2.village,
      taluka: farmer2.taluka,
      district: farmer2.district,
      imageUrl: '/uploads/okra.png',
    });

    // Query 5: Kanubhai Bharwad -> Castor Caterpillar & Defoliation (Pending Review - Ready for Demo!)
    await Query.create({
      title: 'Castor semilooper caterpillar attack and angular leaf spots in Vemar plot',
      titleGu: 'વેમર ગામના ખેતરમાં દિવેલાના પાન પર કાતરા/ઈયળનો ઉપદ્રવ અને ડાઘ',
      description:
        'Caterpillars feeding aggressively on broad castor leaves in Karjan taluka. Leaves have skeletonized appearance with multiple holes. Requesting immediate agronomic solution.',
      descriptionGu:
        'કરજણ તાલુકાના વેમર ગામમાં દિવેલાના મોટા પાંદડા ઈયળો ખાઈને ચાળણી જેવા બનાવી રહી છે. તાત્કાલિક સચોટ દવા કે ઉપાય જણાવવા વિનંતી.',
      crop: 'Castor',
      cropGu: 'દિવેલા/એરંડા',
      urgency: 'High',
      status: 'Pending Review',
      farmerId: farmer3._id,
      farmerName: farmer3.name,
      farmerNameGu: farmer3.nameGu,
      farmerPhone: farmer3.phone,
      village: farmer3.village,
      taluka: farmer3.taluka,
      district: farmer3.district,
      imageUrl: '/uploads/castor.png',
      scanId: scanKanubhai._id,
    });

    console.log('✨ [Seeder] Database seeding completed successfully!');
    console.log('----------------------------------------------------');
    console.log('👥 MOCK ACCOUNTS SEEDED:');
    console.log('1. Farmer 1: ramesh.patel@haritayan.in | Password@123 (Ramesh Patel, Padra)');
    console.log('2. Farmer 2: bhavesh.solanki@haritayan.in | Password@123 (Bhavesh Solanki, Anklav)');
    console.log('3. Farmer 3: kanubhai.bharwad@haritayan.in | Password@123 (Kanubhai Bharwad, Karjan)');
    console.log('4. Officer : dr.hitesh.agri@haritayan.in | Officer@2026 (Dr. Hitesh Trivedi, Agri Officer)');
    console.log('   (NO ADMIN accounts created as per instructions)');
    console.log('----------------------------------------------------');

    return {
      success: true,
      officer,
      farmers: [farmer1, farmer2, farmer3],
    };
  } catch (error) {
    console.error('❌ [Seeder Error]:', error);
    throw error;
  }
};

// If run directly via node
if (process.argv[1] && process.argv[1].endsWith('seedData.js')) {
  seedDatabase()
    .then(() => {
      console.log('🎉 Seeding finished.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Seeding failed:', err);
      process.exit(1);
    });
}

export default seedDatabase;
