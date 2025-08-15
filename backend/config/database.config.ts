import mongoose from "mongoose"
import { Env } from "./env.config"

const connectMongoDB = async () => {
    try {
        const connect = await mongoose.connect(Env.MONGO_URI, {
            serverSelectionTimeoutMS: 8000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000
        })
        console.log(`Connected to MongoDB successfully ${connect.connection.host}`);
    } catch (error) {
        console.log(`Connected to MongoDB failed ${error}`);
        process.exit(1)
    }
}

export default connectMongoDB;