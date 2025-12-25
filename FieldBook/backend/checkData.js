import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/user.model.js';
import Field from './models/field.model.js';
import Booking from './models/booking.model.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const userCount = await User.countDocuments();
  const fieldCount = await Field.countDocuments();
  const bookingCount = await Booking.countDocuments();
  const confirmedBookings = await Booking.find({ status: 'confirmed' });
  const revenue = confirmedBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  
  console.log('Database Stats:');
  console.log('Users:', userCount);
  console.log('Fields:', fieldCount);
  console.log('Bookings:', bookingCount);
  console.log('Confirmed Bookings:', confirmedBookings.length);
  console.log('Revenue:', revenue);
  
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
