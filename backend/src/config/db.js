import mongoose from 'mongoose';
import { ENV } from './env.js';

export const connectDB = async () => {
  try {
    const isLocalUri = !ENV.MONGODB_URI || ENV.MONGODB_URI.includes('127.0.0.1') || ENV.MONGODB_URI.includes('localhost');
    if (isLocalUri && process.env.NODE_ENV === 'production') {
      console.error('=======================================================');
      console.error('[CRITICAL CONFIG ERROR]: MONGODB_URI is not set to a remote MongoDB Atlas connection string!');
      console.error('Current MONGODB_URI:', ENV.MONGODB_URI);
      console.error('Please add MONGODB_URI in Render Dashboard -> Environment Variables.');
      console.error('=======================================================');
    }

    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    console.error('Tip: If using MongoDB Atlas, make sure you whitelist 0.0.0.0/0 in Atlas Network Access and provide valid credentials in MONGODB_URI.');
    process.exit(1);
  }
};
