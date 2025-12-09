import express from "express";
import cors from 'cors'
import dotenv from "dotenv";
import type { Request, Response, NextFunction } from "express";
import ExpressError from "./utils/ExpressError.js";
import connectDb from "./config/Db.js";
import mainRouter from "./routes/main.route.js";
import cookieparser from 'cookie-parser'

dotenv.config();
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors({
  origin:process.env.CLIENT_URL,
  credentials: true
}))
app.use(cookieparser())

//routes 

app.use('/api',mainRouter) // http://localhost:5000/api/..

// 404 Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ExpressError(404, "Endpoint not found!"));
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const { status = 500, message = "Internal Server Error" } = err;

  res.status(status).json({
    success: false,
    message,
  });
});

connectDb("YOUR_CUSTOM_DB_NAME").then(()=>{
  app.listen(port, () => {
    console.log(`Server is listening on port : ${port}`);
  });
})
