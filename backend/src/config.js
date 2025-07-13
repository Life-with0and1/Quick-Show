import mongoose from "mongoose";

const dbConnect = async () => {
    const DB_URL = process.env.DB_URL;
    if (!DB_URL) {
        throw new Error("Database URL not found");
    }
    try {
        mongoose.connection.on("connected", () => {
            console.log("Database connected successfully");
        })
        await mongoose.connect(DB_URL);
        

    } catch (error) {
        console.log("Error while connecting to Database", error);
    }
}

export default dbConnect;