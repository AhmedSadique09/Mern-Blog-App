import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoute.js';
import postRoutes from './routes/postRoute.js';
import commentRoute from './routes/commentRoute.js';
import cookieParser from 'cookie-parser';

mongoose.connect(process.env.MONGO)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',  // your frontend port
  credentials: true                 // allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});


app.use('/api/user', userRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoute);

app.use((err,req,res,next) =>{
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success:false,
    statusCode,
    message,
  });
});