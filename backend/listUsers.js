import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/user.model.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const users = await User.find().limit(5);
  
  console.log('\n=== User Accounts ===\n');
  users.forEach((u, i) => {
    console.log(`${i + 1}. Email: ${u.email}`);
    console.log(`   Role: ${u.role}`);
    console.log(`   Active: ${u.isActive}`);
    console.log(`   Name: ${u.firstName} ${u.lastName}`);
    console.log('');
  });
  
  console.log('TIP: Try logging in with one of these emails.');
  console.log('Default password might be: password, password123, or 123456\n');
  
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
