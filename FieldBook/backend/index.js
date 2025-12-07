import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
dotenv.config();
import userRouter from './routes/user.route.js';
import postRouter from './routes/post.route.js';
import coommentRouter from './routes/comment.js';
import bookingRouter from './routes/booking.route.js';
import fieldRouter from './routes/field.route.js';
import connectDB from './lib/connectDB.js';




const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

// Test route
app.get('/test', (req, res) => {
  res.status(200).json({ message: 'Server is working' });
});

// Correct variable name, should be 'test' not 'text'
// console.log('Text from .env:', process.env.test);  // Logs the value of 'test' from the .env file


// app.get("/test", (req, res) => {

//     res.status(200).send("It works!");
// });

app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/comments', coommentRouter);
app.use('/bookings', bookingRouter);
app.use('/fields', fieldRouter);


app.listen(PORT, () => {

    connectDB();
    console.log("Server is running ");
});
