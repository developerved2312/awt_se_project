import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Query from '../models/Query.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const uri = process.env.MONGODB_URI || 'mongodb+srv://harit_user:haritayan2026@cluster0.nwmj3nq.mongodb.net/haritayan_db?retryWrites=true&w=majority';

async function seedData() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB Atlas successfully.');

    // 1. Seed / Upsert Users
    const defaultPassword = await bcrypt.hash('Password@123', 10);
    const officerPassword = await bcrypt.hash('Officer@2026', 10);
    const adminPassword = await bcrypt.hash('Admin@2026', 10);

    const usersToUpsert = [
      {
        email: 'admin.operations@haritayan.in',
        name: 'District Operations Administrator',
        nameGu: 'જિલ્લા ઓપરેશન્સ સંચાલક',
        password: adminPassword,
        role: 'admin',
        phone: '+91 94299 88102',
        district: 'Vadodara',
        districtGu: 'વડોદરા',
        taluka: 'Vadodara Urban',
        talukaGu: 'વડોદરા શહેર',
        village: 'District Collectorate Operations Center',
        villageGu: 'કલેક્ટર કચેરી સંચાલન કક્ષ',
        designation: 'Superintending Operations Officer & Admin',
        designationGu: 'મુખ્ય જિલ્લા વહીવટી અધિકારી',
        department: 'Revenue & Agriculture Department, Vadodara',
        badgeNumber: 'GJ-VAD-ADM-001',
        officeLocation: '2nd Floor, Operations Command, Collectorate, Vadodara',
      },
      {
        email: 'dr.hitesh.agri@haritayan.in',
        name: 'Dr. Hitesh Trivedi',
        nameGu: 'ડૉ. હિતેશ ત્રિવેદી',
        password: officerPassword,
        role: 'officer',
        phone: '+91 94270 91823',
        district: 'Vadodara',
        districtGu: 'વડોદરા',
        taluka: 'Vadodara Urban',
        talukaGu: 'વડોદરા શહેર',
        village: 'Krishi Bhavan Compound',
        villageGu: 'કૃષિ ભવન સંકુલ',
        designation: 'Senior District Agricultural Officer & Plant Pathologist',
        designationGu: 'વરિષ્ઠ જિલ્લા કૃષિ અધિકારી & પાક રોગ નિષ્ણાત',
        department: 'Dept of Agriculture, Govt of Gujarat & AAU Extension',
        badgeNumber: 'GJ-VAD-AGRI-042',
        officeLocation: 'Room 204, Krishi Bhavan, Kothi Road, Vadodara - 390001',
      },
      {
        email: 'ramesh.patel@haritayan.in',
        name: 'Ramesh Patel',
        nameGu: 'રમેશભાઈ પટેલ',
        password: defaultPassword,
        role: 'farmer',
        phone: '+91 98250 84721',
        district: 'Vadodara',
        districtGu: 'વડોદરા',
        taluka: 'Padra',
        talukaGu: 'પાદરા',
        village: 'Samiyala',
        villageGu: 'સામિયાલા',
        farmSizeAcres: 6.5,
        primaryCrops: ['Cotton (કપાસ)', 'Pigeon Pea (તુવેર)', 'Padra Banana (કેળ)'],
        primaryCropsGu: ['કપાસ', 'તુવેર', 'કેળ'],
      },
      {
        email: 'ramesh@haritayan.in',
        name: 'Ramesh Patel (Padra Field)',
        nameGu: 'રમેશભાઈ પટેલ',
        password: defaultPassword,
        role: 'farmer',
        phone: '+91 98251 44021',
        district: 'Vadodara',
        districtGu: 'વડોદરા',
        taluka: 'Padra',
        talukaGu: 'પાદરા',
        village: 'Samiyala',
        villageGu: 'સામિયાલા',
        farmSizeAcres: 5.0,
        primaryCrops: ['Bt Cotton (બીટી કપાસ)', 'Banana (કેળ)'],
        primaryCropsGu: ['કપાસ', 'કેળ'],
      },
      {
        email: 'bhavesh.solanki@haritayan.in',
        name: 'Bhavesh Solanki',
        nameGu: 'ભાવેશભાઈ સોલંકી',
        password: defaultPassword,
        role: 'farmer',
        phone: '+91 94280 61942',
        district: 'Anand',
        districtGu: 'આણંદ',
        taluka: 'Anklav',
        talukaGu: 'આંકલાવ',
        village: 'Asodar',
        villageGu: 'અસોદર',
        farmSizeAcres: 4.2,
        primaryCrops: ['Tomato (ટામેટા)', 'Okra (ભીંડા)', 'Chili (મરચાં)'],
        primaryCropsGu: ['ટામેટા', 'ભીંડા', 'મરચાં'],
      },
      {
        email: 'kanubhai.bharwad@haritayan.in',
        name: 'Kanubhai Bharwad',
        nameGu: 'કાનુભાઈ ભરવાડ',
        password: defaultPassword,
        role: 'farmer',
        phone: '+91 97140 33819',
        district: 'Vadodara',
        districtGu: 'વડોદરા',
        taluka: 'Karjan',
        talukaGu: 'કરજણ',
        village: 'Vemar',
        villageGu: 'વેમર',
        farmSizeAcres: 8.5,
        primaryCrops: ['Castor (દિવેલા)', 'Cotton (કપાસ)', 'Wheat (ઘઉં)'],
        primaryCropsGu: ['દિવેલા', 'કપાસ', 'ઘઉં'],
      },
      {
        email: 'govind.parmar@haritayan.in',
        name: 'Govindbhai Parmar',
        nameGu: 'ગોવિંદભાઈ પરમાર',
        password: defaultPassword,
        role: 'farmer',
        phone: '+91 99092 34156',
        district: 'Vadodara',
        districtGu: 'વડોદરા',
        taluka: 'Savli',
        talukaGu: 'સાવલી',
        village: 'Manjusar',
        villageGu: 'મંજુસર',
        farmSizeAcres: 11.0,
        primaryCrops: ['Paddy (ડાંગર)', 'Wheat (ઘઉં)', 'Mustard (રાયડો)'],
        primaryCropsGu: ['ડાંગર', 'ઘઉં', 'રાયડો'],
      },
    ];

    for (const u of usersToUpsert) {
      await User.findOneAndUpdate({ email: u.email }, u, { upsert: true, new: true });
    }
    console.log(`Seeded/Updated ${usersToUpsert.length} complete users in MongoDB.`);

    // 2. Fetch references for queries
    const ramesh = await User.findOne({ email: 'ramesh.patel@haritayan.in' });
    const bhavesh = await User.findOne({ email: 'bhavesh.solanki@haritayan.in' });
    const kanu = await User.findOne({ email: 'kanubhai.bharwad@haritayan.in' });
    const govind = await User.findOne({ email: 'govind.parmar@haritayan.in' });
    const officer = await User.findOne({ email: 'dr.hitesh.agri@haritayan.in' });

    // 3. Clear and re-seed queries
    await Query.deleteMany({});

    const dummyQueries = [
      {
        title: 'Rapid leaf curling and vein swelling in 45-day Bt cotton plot',
        titleGu: '૪૫ દિવસના બીટી કપાસમાં પાન વળવા અને નસો ફૂલી જવાની ગંભીર સમસ્યા',
        crop: 'Cotton',
        cropGu: 'કપાસ',
        urgency: 'Urgent',
        status: 'Pending Review',
        farmerId: ramesh?._id,
        farmerName: ramesh?.name || 'Ramesh Patel',
        farmerNameGu: ramesh?.nameGu || 'રમેશભાઈ પટેલ',
        farmerPhone: ramesh?.phone || '+91 98250 84721',
        village: 'Samiyala',
        taluka: 'Padra',
        district: 'Vadodara',
        imageUrl: '/images/cotton.jpeg',
        description:
          'My Bt Cotton hybrid in Samiyala village has developed severe upward leaf curling with thick lower veins. Whitefly population seems very high after the humid spell. Please advise emergency protocol.',
        descriptionGu:
          'સામિયાલા ગામે મારા ૫ એકર કપાસમાં પાનની નસો જાડી થઈને ઉપર તરફ વળી ગઈ છે. સફેદ માખીનો ઉપદ્રવ ખૂબ વધી ગયો છે. કૃપા કરીને તાત્કાલિક દવાનો છંટકાવ જણાવો.',
      },
      {
        title: 'Castor semilooper caterpillar attack and angular leaf spots in Vemar plot',
        titleGu: 'વેમર ગામના ખેતરમાં દિવેલાના પાન પર કાતરા/ઈયળનો ઉપદ્રવ અને ડાઘ',
        crop: 'Castor',
        cropGu: 'દિવેલા/એરંડા',
        urgency: 'High',
        status: 'Pending Review',
        farmerId: kanu?._id,
        farmerName: kanu?.name || 'Kanubhai Bharwad',
        farmerNameGu: kanu?.nameGu || 'કાનુભાઈ ભરવાડ',
        farmerPhone: kanu?.phone || '+91 97140 33819',
        village: 'Vemar',
        taluka: 'Karjan',
        district: 'Vadodara',
        imageUrl: '/images/castor.png',
        description:
          'Caterpillars feeding aggressively on broad castor leaves in Karjan taluka. Leaves have skeletonized appearance with multiple holes. Requesting immediate agronomic solution.',
        descriptionGu:
          'દિવેલાના પાન પર મોટા કાતરા અને ઈયળો જોવા મળી રહી છે, પાન ચાવીને જાળી બનાવી દીધી છે. ઉપાય માટે માર્ગદર્શન આપવા વિનંતી.',
      },
      {
        title: 'Severe yellow vein mosaic virus in Okra with whitefly vector',
        titleGu: 'ભીંડાના પાકમાં પીળી નસોનો વાયરલ રોગ (વાયવીએમવી)',
        crop: 'Okra',
        cropGu: 'ભીંડા',
        urgency: 'High',
        status: 'Pending Review',
        farmerId: bhavesh?._id,
        farmerName: bhavesh?.name || 'Bhavesh Solanki',
        farmerNameGu: bhavesh?.nameGu || 'ભાવેશભાઈ સોલંકી',
        farmerPhone: bhavesh?.phone || '+91 94280 61942',
        village: 'Asodar',
        taluka: 'Anklav',
        district: 'Anand',
        imageUrl: '/images/okra.png',
        description:
          'Young leaves at the top canopy are developing bright yellow veins while interveinal areas remain green. Need bio-friendly and chemical spray to check spread.',
        descriptionGu:
          'ભીંડાની ટોચના નવા પાનની નસો એકદમ પીળી થઈ ગઈ છે. સફેદ માખીઓ ઉડતી દેખાય છે. બીજા છોડમાં રોગ ન ફેલાય તે માટે સલાહ આપો.',
      },
      {
        title: 'Flower bud shedding and leaf webber inspection in Tur / Pigeon Pea',
        titleGu: 'તુવેરમાં ફૂલ કળીઓ ખરી પડવી અને પાન ગૂંથનારી ઈયળની તપાસ',
        crop: 'Pigeon Pea',
        cropGu: 'તુવેર',
        urgency: 'Medium',
        status: 'Pending Review',
        farmerId: ramesh?._id,
        farmerName: ramesh?.name || 'Ramesh Patel',
        farmerNameGu: ramesh?.nameGu || 'રમેશભાઈ પટેલ',
        farmerPhone: ramesh?.phone || '+91 98250 84721',
        village: 'Samiyala',
        taluka: 'Padra',
        district: 'Vadodara',
        imageUrl: '/images/pigeon_pea.jpg',
        description:
          'Tur crop planted along field borders is starting to flower. Minor webbing of leaves noticed. Need safe organic recommendation before heavy flowering commences.',
        descriptionGu:
          'તુવેરના છોડ પર ફૂલો બેસવાની શરૂઆત થઈ છે ત્યારે પાંદડાં ગૂંથાયેલા જોવા મળે છે. ફૂલ ખરે નહીં તે માટે યોગ્ય જૈવિક સલાહ આપો.',
      },
      {
        title: 'Bacterial Leaf Blight and water-soaked lesions in Paddy nursery',
        titleGu: 'ડાંગરની રોપણીમાં પાનનો બેક્ટેરિયલ સુકારો અને પાણીપોચા ડાઘ',
        crop: 'Paddy',
        cropGu: 'ડાંગર',
        urgency: 'Urgent',
        status: 'Pending Review',
        farmerId: govind?._id,
        farmerName: govind?.name || 'Govindbhai Parmar',
        farmerNameGu: govind?.nameGu || 'ગોવિંદભાઈ પરમાર',
        farmerPhone: govind?.phone || '+91 99092 34156',
        village: 'Manjusar',
        taluka: 'Savli',
        district: 'Vadodara',
        imageUrl: '/images/healthy-crop.jpeg',
        description:
          'Transplanted paddy in 11 acres Savli tract showing wave-like translucent lesions on leaf tips. Leaves drying from tip downward with milky bacterial ooze in morning dew.',
        descriptionGu:
          'સાવલી તાલુકાના મંજુસર ગામે ડાંગરના પાનની ટોચ પરથી પીળા-બદામી રંગનો સુકારો શરૂ થયો છે. સવારે પાન પર સફેદ ટીપાં દેખાય છે. કંટ્રોલ કરવા માર્ગદર્શન આપો.',
      },
      {
        title: 'Brown circular bullseye spots on lower leaves of hybrid tomato',
        titleGu: 'હાઇબ્રિડ ટામેટાના નીચલા પાન પર ગોળ ચક્રાકાર કથ્થાઈ ટપકાં (સુકારો)',
        crop: 'Tomato',
        cropGu: 'ટામેટા',
        urgency: 'High',
        status: 'Reviewed',
        farmerId: bhavesh?._id,
        farmerName: bhavesh?.name || 'Bhavesh Solanki',
        farmerNameGu: bhavesh?.nameGu || 'ભાવેશભાઈ સોલંકી',
        farmerPhone: bhavesh?.phone || '+91 94280 61942',
        village: 'Asodar',
        taluka: 'Anklav',
        district: 'Anand',
        imageUrl: '/images/tomato.jpg',
        description:
          'Lower foliage in 3-acre tomato plot in Asodar showing dark brown concentric rings surrounded by yellow halos. Older leaves drying and dropping off.',
        descriptionGu:
          'ટામેટાના જૂના પાન પર ગોળાકાર કથ્થાઈ ટપકાં પડ્યા છે અને પાન ખરી રહ્યા છે.',
        officerResponse: {
          officerId: officer?._id,
          officerName: 'Dr. Hitesh Trivedi',
          officerBadge: 'GJ-VAD-AGRI-042',
          designation: 'Senior District Agricultural Officer',
          comment:
            'Official Diagnosis: Alternaria Early Blight fungus. Do not use furrow or flood irrigation in evenings. Prune infected bottom 6 inches of foliage and spray Mancozeb promptly.',
          commentGu:
            'સત્તાવાર તપાસ: ટામેટાનો અલ્ટરનેરિયા અર્લી બ્લાઇટ (આગોતરો સુકારો) ફૂગજન્ય રોગ છે. સાંજના સમયે પાણી આપવાનું ટાળો અને નીચેના પાન કાપીને મેન્કોઝેબનો છંટકાવ કરો.',
          prescribedRemedies: [
            'Mancozeb 75 WP @ 30g per 15L pump',
            'Sour buttermilk spray (500ml/pump) with 10g turmeric for foliar resistance',
            'Trim diseased foliage touching the soil bed',
          ],
          prescribedRemediesGu: [
            'મેન્કોઝેબ ૭૫ ડબ્લ્યુપી ૩૦ ગ્રામ પ્રતિ ૧૫ લીટર પંપ છાંટવું',
            '૧૫ લીટર પાણીમાં ૫૦૦ મિલી ખાટી છાશ અને ૧૦ ગ્રામ હળદર ભેળવી છાંટવી',
            'જમીનને અડતા નીચેના પાન કાપી દૂર કરવા',
          ],
          respondedAt: new Date(Date.now() - 3600000 * 12),
        },
      },
    ];

    await Query.insertMany(dummyQueries);
    console.log(`Seeded ${dummyQueries.length} comprehensive consultation requests in MongoDB Atlas.`);

    await mongoose.disconnect();
    console.log('Database seeding successfully finished.');
    process.exit(0);
  } catch (err) {
    console.error('Error during seeding:', err);
    process.exit(1);
  }
}

seedData();

