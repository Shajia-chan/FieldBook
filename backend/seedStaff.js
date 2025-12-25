require('dotenv').config();
const mongoose = require('mongoose');
const Staff = require('./models/staff.model'); // Note: no .default

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://parisarahman_db_user:1234abcd@cluster0.i2qbobe.mongodb.net/football-booking?retryWrites=true&w=majority';

const staffData = [
  { name: "Rafiq Ahmed", role: "Referee", location: "Dhaka", available: true },
  { name: "Salma Khatun", role: "Volunteer", location: "Chittagong", available: true },
  { name: "Jahid Hasan", role: "Referee", location: "Dhaka", available: true },
  { name: "Nazia Akter", role: "Volunteer", location: "Sylhet", available: true },
  { name: "Tanvir Hossain", role: "Referee", location: "Chittagong", available: true },
  { name: "Anika Rahman", role: "Volunteer", location: "Dhaka", available: true }
];

async function seedStaffDatabase() {
  try {
    console.log('🌱 Starting Staff Database Seeding Process...\n');

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Staff.deleteMany({});
    console.log('🗑️ Existing staff cleared');

    const staff = await Staff.insertMany(staffData);
    console.log(`✅ Inserted ${staff.length} staff members`);

    staff.forEach((s, i) => {
      console.log(`${i + 1}. ${s.name} (${s.role}) - ${s.location} - Available: ${s.available}`);
    });

    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedStaffDatabase();
