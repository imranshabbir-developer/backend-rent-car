import mongoose from 'mongoose';
import 'colors';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    console.log(`Database connected successfully ${conn.connection.host}`.bgBlue);
    return conn;
  } catch (error) {
    console.error(`Database connection error: ${error.message}`.red);
    throw error; // Don't exit - let server handle it
  }
};

export default connectDB;

