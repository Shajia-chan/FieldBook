import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/user.model.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const testPasswords = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const email = 'anika@gmail.com';
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }
    
    console.log('\n=== Testing Passwords ===');
    console.log(`Email: ${email}`);
    console.log(`Has password: ${!!user.password}`);
    console.log(`Password hash length: ${user.password?.length || 0}`);
    
    const passwords = ['123456', 'password', 'password123', '1234567'];
    
    console.log('\nTrying common passwords:');
    for (const pwd of passwords) {
      const match = await bcrypt.compare(pwd, user.password);
      console.log(`  ${pwd}: ${match ? '✓ MATCH' : '✗ no match'}`);
      if (match) {
        console.log(`\n✓ Found working password: ${pwd}\n`);
        process.exit(0);
      }
    }
    
    console.log('\n✗ None of the common passwords worked.');
    console.log('Run: node resetPassword.js anika@gmail.com 123456');
    console.log('to reset the password.\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testPasswords();
