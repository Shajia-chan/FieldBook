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

const migrateBookings = async () => {
  try {
    console.log('\n=== BOOKING MIGRATION ===\n');
    
    // Find all bookings without orderId (old bookings)
    const oldBookings = await Booking.find({ 
      $or: [
        { orderId: { $exists: false } },
        { orderId: null }
      ]
    });
    
    console.log(`Found ${oldBookings.length} old bookings without orderId\n`);
    
    if (oldBookings.length === 0) {
      console.log('No migration needed!');
      process.exit(0);
    }
    
    // Generate order IDs for old bookings and set status to "pending"
    const generateOrderId = () => {
      const timestamp = Date.now().toString(36);
      const randomStr = Math.random().toString(36).substr(2, 9);
      const extra = Math.random().toString(36).substr(2, 5);
      return `ORD-${timestamp}-${randomStr}-${extra}`.toUpperCase();
    };
    
    let updated = 0;
    let errors = 0;
    
    for (const booking of oldBookings) {
      try {
        // Check if it has a status, if not set it to pending
        const hasStatus = booking.status !== undefined && booking.status !== null;
        
        const updateData = {
          orderId: generateOrderId(),
        };
        
        // Set status to pending if it's not set or is something else
        if (!hasStatus || booking.status === 'confirmed') {
          updateData.status = 'pending';
        }
        
        await Booking.findByIdAndUpdate(booking._id, updateData);
        
        console.log(`Updated booking ${booking._id}: Added orderId, status set to pending`);
        updated++;
      } catch (error) {
        console.error(`Error updating booking ${booking._id}:`, error.message);
        errors++;
      }
    }
    
    console.log(`\nMigration complete!`);
    console.log(`Updated: ${updated}`);
    console.log(`Errors: ${errors}`);
    
    // Show updated bookings
    console.log('\n=== BOOKINGS AFTER MIGRATION ===\n');
    const allBookings = await Booking.find().sort({ createdAt: -1 }).limit(10);
    
    allBookings.forEach((booking, index) => {
      console.log(`Booking ${index + 1}:`);
      console.log(`  ID: ${booking._id}`);
      console.log(`  Order ID: ${booking.orderId}`);
      console.log(`  Status: "${booking.status}"`);
      console.log(`  Created: ${booking.createdAt}`);
      console.log('');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

await connectDB();
await migrateBookings();
