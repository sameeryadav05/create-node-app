import User from "../models/User.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import ExpressError from "../utils/ExpressError.js";
import { sendToken } from "../utils/jwt.js";
import sendMail from "../utils/SendEmail.js";
import WrapAsync from "../utils/WrapAsync.js";

import type { Request, Response } from "express";

export const signup = WrapAsync(async (req: Request, res: Response) => {
  const { name, email, password, mobile } = req.body;


  if (!name || !email || !password) {
    throw new ExpressError(400, "Incomplete credentials!");
  }


  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new ExpressError(400, "Email already exists, please login!");
  }

  const hashedPass = await hashPassword(password);

 const otp = Math.floor(100000 + Math.random() * 900000);

   const user = await User.create({
    name,
    email,
    password: hashedPass,
    mobile,
    otp,
    otpExp:Date.now() + 5 * 60 * 1000  // 5 min expiry
  });


  await sendMail(otp,email);

  res.status(201).json({
    success: true,
    message: "6 digits verification code is sent to email"
  });
});

export const verifyOtp = WrapAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ExpressError(400, "Email and OTP are required");
  }


  const user = await User.findOne({ email });

  if (!user) {
    throw new ExpressError(400, "User not found!");
  }

 
  if (user.isVerified) {
    throw new ExpressError(400, "User already verified!");
  }


  if (!user.otp || !user.otpExp || user.otpExp < Date.now()) {
    throw new ExpressError(400, "Invalid or expired OTP!");
  }


  if (String(otp) !== String(user.otp)) {
    throw new ExpressError(400, "Invalid OTP!");
  }


  user.otp = null;
  user.otpExp = null;
  user.isVerified = true;


  await user.save();

  const token = sendToken(String(user._id));

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: false, // set true in production with https
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({
      success: true,
      message: "Registered Successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
    });
});


export const signin = WrapAsync(async(req:Request,res:Response)=>{
  const {email,password} = req.body
  let user = await User.findOne({email}).select("+password")
  if(!user)
  {
    throw new ExpressError(400,"Invalid credentials !");
  }

  if (!user.isVerified) {
    throw new ExpressError(403, "Please verify your email first!");
  }


  const isPasswordMatch = await comparePassword(password,user.password)

  if(!isPasswordMatch)
  {
    throw new ExpressError(401,"Invalid Credentials !")
  }


  const token = sendToken(String(user._id));

  res.cookie("token",token,{
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  }).status(200).json({
    success:true,
    message:"Login SuccessFully !",
    user:{
      id:user._id,
      name:user.name,
      email:user.email,
      mobile:user.mobile
    }
  })
})
