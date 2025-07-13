import mongoose from "mongoose";
// require("dotenv").config()
const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log('Mongodb connected');
    })
    await mongoose.connect(`${process.env.MONGODB_URI}/spotify`);
}

export default connectDB;