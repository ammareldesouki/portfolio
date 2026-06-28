import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { env } from './config/env';
import { User } from './models/User';

async function seed() {
  await mongoose.connect(env.mongodbUri);
  console.log('[Seed] Connected to MongoDB');

  const existing = await User.findOne({ email: 'admin@flutter.dev' });
  if (existing) {
    console.log('[Seed] Admin user already exists');
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash('admin123', 12);
  await User.create({
    email: 'admin@flutter.dev',
    password: hashedPassword,
    displayName: 'Admin User',
  });

  console.log('[Seed] Admin user created (email: admin@flutter.dev, password: admin123)');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('[Seed] Error:', err);
  process.exit(1);
});
