import mongoose from 'mongoose';
import Booking from './models/booking.model.js';

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://Shajia2:Shajia33@football.tqga4wh.mongodb.net/?appName=Football");
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const checkBookings = async () => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 }).limit(10);
    
    console.log('\n=== BOOKINGS IN DATABASE ===');
    console.log(`Total bookings: ${bookings.length}\n`);
    
    bookings.forEach((booking, index) => {
      console.log(`Booking ${index + 1}:`);
      console.log(`  ID: ${booking._id}`);
      console.log(`  Order ID: ${booking.orderId}`);
      console.log(`  Status: "${booking.status}" (type: ${typeof booking.status})`);
      console.log(`  Created: ${booking.createdAt}`);
      console.log('');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking bookings:', error);
    process.exit(1);
  }
};

await connectDB();
await checkBookings();
