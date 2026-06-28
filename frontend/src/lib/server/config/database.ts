import mongoose from 'mongoose';
import { env } from './env';

let isConnected = false;

export async function connectDatabase() {
  if (isConnected) return;
  try {
    await mongoose.connect(env.mongodbUri);
    isConnected = true;
    console.log('[DB] Connected to MongoDB');
  } catch (error) {
    console.error('[DB] Connection error:', error);
    throw error;
  }
}
