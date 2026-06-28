import { connectDatabase } from './src/lib/server/config/database';
import { User } from './src/lib/server/models/User';
import bcrypt from 'bcryptjs';

async function seed() {
  await connectDatabase();

  const existing = await User.findOne({ email: 'admin@flutter.dev' });
  if (existing) {
    console.log('Admin user already exists');
    process.exit(0);
  }

  const hashed = await bcrypt.hash('admin123', 10);
  await User.create({
    email: 'admin@flutter.dev',
    password: hashed,
    displayName: 'Admin',
  });

  console.log('Admin user created: admin@flutter.dev / admin123');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
