require('dotenv').config();
const mongoose = require('mongoose');
const Field = require('./models/Field');

// Use environment variable or hardcoded connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://parisarahman_db_user:1234abcd@cluster0.i2qbobe.mongodb.net/football-booking?retryWrites=true&w=majority';

const seedData = [
  {
    fieldName: "Green Valley Football Field",
    location: "Dhaka, Gulshan",
    pricePerHour: 2000,
    availableTimeSlots: [
      { time: "06:00-08:00", isBooked: false },
      { time: "08:00-10:00", isBooked: false },
      { time: "10:00-12:00", isBooked: true },
      { time: "14:00-16:00", isBooked: false },
      { time: "16:00-18:00", isBooked: false },
      { time: "18:00-20:00", isBooked: false }
    ],
    hasLocker: true,
    hasSwimmingPool: true,
    capacity: 22,
    facilities: ["Locker", "Swimming Pool", "Parking", "Cafeteria"],
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=400",
    description: "Premium football field with excellent facilities and swimming pool"
  },
  {
    fieldName: "City Sports Complex",
    location: "Dhaka, Banani",
    pricePerHour: 1500,
    availableTimeSlots: [
      { time: "06:00-08:00", isBooked: false },
      { time: "08:00-10:00", isBooked: false },
      { time: "10:00-12:00", isBooked: false },
      { time: "14:00-16:00", isBooked: true },
      { time: "16:00-18:00", isBooked: false },
      { time: "18:00-20:00", isBooked: false }
    ],
    hasLocker: true,
    hasSwimmingPool: false,
    capacity: 22,
    facilities: ["Locker", "Parking", "Cafeteria", "First Aid"],
    rating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400",
    description: "Modern sports complex in the heart of Banani"
  },
  {
    fieldName: "Riverside Football Ground",
    location: "Dhaka, Uttara",
    pricePerHour: 1800,
    availableTimeSlots: [
      { time: "06:00-08:00", isBooked: false },
      { time: "08:00-10:00", isBooked: false },
      { time: "10:00-12:00", isBooked: false },
      { time: "14:00-16:00", isBooked: false },
      { time: "16:00-18:00", isBooked: false },
      { time: "18:00-20:00", isBooked: true }
    ],
    hasLocker: false,
    hasSwimmingPool: true,
    capacity: 18,
    facilities: ["Swimming Pool", "Parking", "Viewing Area"],
    rating: 4.0,
    imageUrl: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=400",
    description: "Beautiful riverside location with pool facilities"
  },
  {
    fieldName: "Champions Arena",
    location: "Dhaka, Dhanmondi",
    pricePerHour: 2500,
    availableTimeSlots: [
      { time: "06:00-08:00", isBooked: false },
      { time: "08:00-10:00", isBooked: false },
      { time: "10:00-12:00", isBooked: false },
      { time: "14:00-16:00", isBooked: false },
      { time: "16:00-18:00", isBooked: true },
      { time: "18:00-20:00", isBooked: false }
    ],
    hasLocker: true,
    hasSwimmingPool: true,
    capacity: 22,
    facilities: ["Locker", "Swimming Pool", "Parking", "Cafeteria", "Gym", "Changing Rooms"],
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1624880357913-a8539238245b?w=400",
    description: "Premium arena with world-class facilities"
  },
  {
    fieldName: "Sunset Sports Field",
    location: "Chittagong, Agrabad",
    pricePerHour: 1200,
    availableTimeSlots: [
      { time: "06:00-08:00", isBooked: false },
      { time: "08:00-10:00", isBooked: false },
      { time: "10:00-12:00", isBooked: false },
      { time: "14:00-16:00", isBooked: false },
      { time: "16:00-18:00", isBooked: false },
      { time: "18:00-20:00", isBooked: false }
    ],
    hasLocker: false,
    hasSwimmingPool: false,
    capacity: 18,
    facilities: ["Parking", "Seating Area"],
    rating: 3.8,
    imageUrl: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400",
    description: "Affordable field in Chittagong"
  },
  {
    fieldName: "Elite Football Academy",
    location: "Dhaka, Mirpur",
    pricePerHour: 2200,
    availableTimeSlots: [
      { time: "06:00-08:00", isBooked: false },
      { time: "08:00-10:00", isBooked: true },
      { time: "10:00-12:00", isBooked: false },
      { time: "14:00-16:00", isBooked: false },
      { time: "16:00-18:00", isBooked: false },
      { time: "18:00-20:00", isBooked: false }
    ],
    hasLocker: true,
    hasSwimmingPool: true,
    capacity: 22,
    facilities: ["Locker", "Swimming Pool", "Parking", "Training Equipment", "Video Analysis Room"],
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=400",
    description: "Professional training facility with swimming pool"
  },
  {
    fieldName: "Green Park Stadium",
    location: "Sylhet, Zindabazar",
    pricePerHour: 1400,
    availableTimeSlots: [
      { time: "06:00-08:00", isBooked: false },
      { time: "08:00-10:00", isBooked: false },
      { time: "10:00-12:00", isBooked: false },
      { time: "14:00-16:00", isBooked: false },
      { time: "16:00-18:00", isBooked: false },
      { time: "18:00-20:00", isBooked: false }
    ],
    hasLocker: true,
    hasSwimmingPool: false,
    capacity: 20,
    facilities: ["Locker", "Parking", "Cafeteria"],
    rating: 4.1,
    imageUrl: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400",
    description: "Well-maintained stadium in Sylhet"
  },
  {
    fieldName: "Bay View Sports Complex",
    location: "Chittagong, Patenga",
    pricePerHour: 1600,
    availableTimeSlots: [
      { time: "06:00-08:00", isBooked: false },
      { time: "08:00-10:00", isBooked: false },
      { time: "10:00-12:00", isBooked: false },
      { time: "14:00-16:00", isBooked: false },
      { time: "16:00-18:00", isBooked: false },
      { time: "18:00-20:00", isBooked: false }
    ],
    hasLocker: true,
    hasSwimmingPool: true,
    capacity: 22,
    facilities: ["Locker", "Swimming Pool", "Parking", "Beach Access"],
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400",
    description: "Unique beachside location with pool"
  }
];

async function seedDatabase() {
  try {
    console.log('========================================');
    console.log('Starting Database Seeding Process...');
    console.log('========================================');
    
    console.log('\n📡 Connecting to MongoDB Atlas...');
    console.log('Connection String:', MONGODB_URI.replace(/\/\/.*:.*@/, '//****:****@')); // Hide credentials in log
    
    await mongoose.connect(MONGODB_URI);
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('📊 Database:', mongoose.connection.name);

    console.log('\n🗑️  Clearing existing fields from database...');
    const deleteResult = await Field.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} existing field(s)`);

    console.log('\n📥 Inserting new seed data...');
    const fields = await Field.insertMany(seedData);
    console.log(`✅ Successfully inserted ${fields.length} field(s)!`);

    console.log('\n📋 Inserted Fields:');
    console.log('========================================');
    fields.forEach((field, index) => {
      console.log(`${index + 1}. ${field.fieldName}`);
      console.log(`   📍 Location: ${field.location}`);
      console.log(`   💰 Price: ৳${field.pricePerHour}/hour`);
      console.log(`   ⭐ Rating: ${field.rating}`);
      console.log(`   🏊 Pool: ${field.hasSwimmingPool ? 'Yes' : 'No'}`);
      console.log('   ────────────────────────────────────');
    });

    console.log('\n✅ Database seeding completed successfully!');
    console.log('========================================\n');

    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    console.log('✨ All done! You can now start your server.\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding database:');
    console.error('========================================');
    console.error('Error Message:', error.message);
    console.error('Error Name:', error.name);
    
    if (error.name === 'MongooseServerSelectionError') {
      console.error('\n💡 Troubleshooting Tips:');
      console.error('1. Check your internet connection');
      console.error('2. Verify your MongoDB Atlas credentials');
      console.error('3. Check if your IP is whitelisted in MongoDB Atlas');
      console.error('4. Ensure your .env file has correct MONGODB_URI');
    }
    
    console.error('========================================\n');
    process.exit(1);
  }
}

// Run the seed function
console.log('\n🌱 Football Field Booking System - Database Seeder\n');
seedDatabase();