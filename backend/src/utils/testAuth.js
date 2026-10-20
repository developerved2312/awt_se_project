import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Query from '../models/Query.js';
import { generateToken } from '../utils/generateToken.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function verifyAuthSystem() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables.');
  }
  console.log('🔍 Testing Auth & Multi-User System...');
  await mongoose.connect(MONGODB_URI);

  // 1. Check Farmer 1
  const farmer = await User.findOne({ email: 'ramesh.patel@haritayan.in' });
  if (!farmer) throw new Error('Farmer 1 not found in DB');

  const farmerPassMatch = await farmer.matchPassword('Password@123');
  console.log('✅ Farmer 1 Password Hash verification:', farmerPassMatch ? 'MATCHED' : 'FAILED');

  const farmerWrongMatch = await farmer.matchPassword('WrongPass');
  console.log('✅ Farmer 1 Wrong password rejected:', !farmerWrongMatch ? 'SUCCESS' : 'FAILED');

  // 2. Check Officer
  const officer = await User.findOne({ email: 'dr.hitesh.agri@haritayan.in' });
  if (!officer) throw new Error('Officer not found in DB');

  const officerPassMatch = await officer.matchPassword('Officer@2026');
  console.log('✅ Officer Password Hash verification:', officerPassMatch ? 'MATCHED' : 'FAILED');

  // 3. Check Queries in DB
  const totalQueries = await Query.countDocuments();
  console.log(`✅ Total Agronomist queries in DB: ${totalQueries}`);

  const farmerQueries = await Query.find({ farmerId: farmer._id });
  console.log(`✅ Ramesh Patel queries count: ${farmerQueries.length}`);

  const token = generateToken(farmer._id, farmer.role);
  console.log('✅ JWT generated successfully (length):', token.length);

  await mongoose.disconnect();
  console.log('🎉 Multi-User Backend Verification Complete!');
}

verifyAuthSystem().catch((err) => {
  console.error('❌ Verification Error:', err);
  process.exit(1);
});
