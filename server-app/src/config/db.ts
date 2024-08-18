import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDb = async () => {
    try {
      const connect = await mongoose.connect(`${process.env.CONNECTION_STRING}`);
      console.log("MongoDB Connected: ", connect.connection.host, connect.connection.name);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };

  export const closeDB = async () => {
    try {
      await mongoose.connection.close();
      console.log('MongoDB disconnected...');
    } catch (error: any) {
      console.error('MongoDB disconnection error:', error.message);
    }
  };