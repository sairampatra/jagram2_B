import { DB_URL } from "./serverConfig.js";
import mongoose from "mongoose"
export const connectToDb = async () => {
    try {
        await mongoose.connect(DB_URL)
        console.log('connected to DB')
    } catch (error) {
        console.log(error)
    }
}

export default connectToDb;