import express from 'express';
import { signin, signup, verifyOtp } from '../controllers/Auth.controller.js';
import VerifyAuth from '../middlewares/verifyAuth.js';


const authRouter = express.Router();

authRouter.post('/signup',signup)  // http://localhost:5000/api/auth/signup
authRouter.post('/verifyOtp',verifyOtp) // http://localhost:5000/api/auth/verifyOtp
authRouter.post('/signin',signin)  // http://localhost:5000/api/auth/signin


authRouter.get('/verifyAuth',VerifyAuth,(req,res)=>{
    res.json({success:true,message:"Authorized", user:req.user,})
})
export default authRouter;