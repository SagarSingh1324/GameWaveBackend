import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();
import connectDB from './config/db.js';

import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const port = process.env.PORT || 5000;

try {
    connectDB();
} catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); 
}

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());
// enable cors
app.use(cors({
  origin: 'http://localhost:9100', // Your frontend URL
  credentials: true,              // Allow cookies
}));


app.get('/', (req, res)=>{
    res.send('api is running');
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/images', imageRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, '0.0.0.0', () => {
    console.log(`server is running on port ${port}`)
});