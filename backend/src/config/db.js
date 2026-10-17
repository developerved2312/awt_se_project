import mongoose from 'mongoose';

/**
 * Connects to MongoDB Atlas using Mongoose.
 * Reads the connection URI from process.env.MONGODB_URI.
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
    console.log('----------------------------------------------------');
    console.warn('⚠️  [MongoDB] MONGODB_URI is not configured yet or has placeholder values.');
    console.warn('ℹ️  Please update your backend/.env file with your actual Atlas connection string.');
    console.log('----------------------------------------------------');
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log('----------------------------------------------------');
    console.log(`🌿 MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`📂 Database Name: ${conn.connection.name}`);
    console.log('----------------------------------------------------');
  } catch (error) {
    console.error('----------------------------------------------------');
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('ℹ️  Check that your IP address is whitelisted in MongoDB Atlas Network Access.');
    console.log('----------------------------------------------------');
  }
};

export default connectDB;
