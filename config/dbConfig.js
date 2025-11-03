import mongoose from 'mongoose';
import 'colors';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`Database connected successfully ${conn.connection.host}`.bgBlue);
  } catch (error) {
    console.error(`Error: ${error.message}`.red);
    process.exit(1);
  }
};

export default connectDB;

