import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/seuconnect',
  JWT_SECRET: process.env.JWT_SECRET || 'seuconnect_secret_academic_key_2026_seusl',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || '',
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || '',
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || ''
};
