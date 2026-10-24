import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import MandiPrice from '../models/MandiPrice.js';
import { INITIAL_MANDI_PRICES, VADODARA_APMCS } from './mandiData.js';

// Setup environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

export const seedMandiPrices = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error(
        'MONGODB_URI is not defined in environment variables. Please configure MONGODB_URI in backend/.env'
      );
    }

    console.log('🌱 [MandiSeeder] Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
    console.log('✅ [MandiSeeder] Connected successfully to MongoDB Atlas.');

    console.log(`📊 [MandiSeeder] Seeding ${INITIAL_MANDI_PRICES.length} authentic APMC market price records...`);

    // We use bulk upsert by (mandi, commodity) so running seed repeatedly safely updates/refreshes records
    const operations = INITIAL_MANDI_PRICES.map((item) => ({
      updateOne: {
        filter: { mandi: item.mandi, commodity: item.commodity },
        update: {
          $set: {
            ...item,
            lastUpdated: new Date(),
            priceDate: new Date(),
          },
        },
        upsert: true,
      },
    }));

    const result = await MandiPrice.bulkWrite(operations);
    console.log(`✅ [MandiSeeder] Bulk write completed:`, {
      matched: result.matchedCount,
      modified: result.modifiedCount,
      upserted: result.upsertedCount,
    });

    const count = await MandiPrice.countDocuments();
    console.log(`🌾 [MandiSeeder] Total APMC Mandi price records in collection: ${count}`);

    return { success: true, count };
  } catch (error) {
    console.error('❌ [MandiSeeder] Error seeding Mandi prices:', error.message);
    throw error;
  }
};

// If run directly via `node seedMandiData.js`
if (process.argv[1] && process.argv[1].endsWith('seedMandiData.js')) {
  seedMandiPrices()
    .then(() => {
      console.log('🎉 Mandi seeding finished successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('💥 Mandi seeding failed:', err.message);
      process.exit(1);
    });
}

export default seedMandiPrices;
