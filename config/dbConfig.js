import mongoose from 'mongoose';
import 'colors';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`Database connected successfully ${conn.connection.host}`.bgBlue);
    return conn;
  } catch (error) {
    console.error(`Database connection error: ${error.message}`.red);
    throw error; // Don't exit - let server handle it
  }
};

export default connectDB;

