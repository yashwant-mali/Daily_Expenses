import mongoose from "mongoose";

let isConnected = false; // To avoid multiple connections

export const connectDB = async () => {
    if (isConnected) return;

    try {
        // await mongoose.connect("mongodb://127.0.0.1:27017/ExpenseDb", {
            //add here the deployed db url
            await mongoose.connect(process.env.MONGODB_URI, {

            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        isConnected = true;
        console.log("✅ MongoDB Connected (Local)");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
    }
};
