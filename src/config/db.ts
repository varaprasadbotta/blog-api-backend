import mongoose, { Mongoose } from 'mongoose';

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI as string);
    console.log('connecte to DB 🧠');
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
