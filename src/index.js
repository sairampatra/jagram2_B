import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PORT } from "./config/serverConfig.js";
import connectToDb from "./config/dbConfig.js";
import apiRouter from './router/v1/apiRouter.js'

const app = express();
connectToDb();
// app.use(urlencoded({ extended: true }));


app.use(express.json()); //middlewares
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions))


app.get('/',(req,res)=>{
    return res.status(201).json({
        message:'this is message',
        success:true
    })
    
})

app.use('/api',apiRouter)   // setting up router

const port = PORT; 
app.listen(port, () => {
  console.log(`soroboro started at port ${port}`); // setting up port
});
