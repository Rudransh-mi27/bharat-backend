import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const dbURI = process.env.DATABASE || 'mongodb://127.0.0.1:27017/eduspark';
    const conn = await mongoose.connect(dbURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
