import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
dotenv.config();
import userRouter from './routes/user.route.js';
import bookingRouter from './routes/booking.route.js';
import fieldRouter from './routes/field.route.js';
import tournamentRouter from './routes/tournament.route.js';
import connectDB from './lib/connectDB.js';




const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

// Test route
app.get('/test', (req, res) => {
  res.status(200).json({ message: 'Server is working' });
});

// Debug route - check booking schema
app.get('/debug/bookings-sample', async (req, res) => {
  try {
    const Booking = (await import('./models/booking.model.js')).default;
    const bookings = await Booking.find().limit(3);
    res.status(200).json({
      message: 'Sample bookings from database',
      count: bookings.length,
      bookings: bookings.map(b => ({
        _id: b._id,
        orderId: b.orderId,
        status: b.status,
        statusType: typeof b.status,
        timeSlot: b.timeSlot,
        createdAt: b.createdAt,
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check the booking model schema
app.get('/debug/booking-schema', (req, res) => {
  try {
    const Booking = require('./models/booking.model.js').default;
    const schemaObj = Booking.schema.obj;
    res.status(200).json({
      message: 'Booking schema',
      statusField: schemaObj.status,
      allFields: Object.keys(schemaObj),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Correct variable name, should be 'test' not 'text'
// console.log('Text from .env:', process.env.test);  // Logs the value of 'test' from the .env file


// app.get("/test", (req, res) => {

//     res.status(200).send("It works!");
// });

app.use('/api/users', userRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/fields', fieldRouter);
app.use('/api/tournaments', tournamentRouter);


app.listen(PORT, () => {

    connectDB();
    console.log("Server is running ");
});
