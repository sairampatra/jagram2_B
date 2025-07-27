import dotenv from 'dotenv'
dotenv.config()

export const DB_URL = process.env.DB_URL;
export const PORT = process.env.PORT;
export const JWT_SECRET = process.env.JWT_SECRET;

export const cloud_name= process.env.CLOUDINARY_CLOUD_NAME
export const api_key= process.env.CLOUDINARY_API_KEY
export const api_secret= process.env.CLOUDINARY_API_SECRET