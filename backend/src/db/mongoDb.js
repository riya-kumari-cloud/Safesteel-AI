import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const connectDB = async () => {
  try {
    let mongoURI = process.env.MONGODB_URI;

    // Use memory server if explicitly told to, or if the default local URI is used but we want to ensure it runs
    if (!mongoURI || mongoURI === 'mongodb://localhost:27017/safesteel') {
      console.log('🔄 Starting MongoDB Memory Server for local verification...');
      const mongoServer = await MongoMemoryServer.create();
      mongoURI = mongoServer.getUri();
    }

    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
    console.log(`📦 MongoDB Connected to: ${mongoURI}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.warn('⚠️ Proceeding without MongoDB. Database-dependent routes will fail.');
  }
};

export default connectDB;
