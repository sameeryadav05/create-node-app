import User from "../models/User.js";
import ExpressError from "../utils/ExpressError.js";
import { verifyToken } from "../utils/jwt.js";
import type { NextFunction, Request, Response } from "express";

const VerifyAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      throw new ExpressError(401, "Unauthorized! Token not found");
    }

    const isValid = verifyToken(token);

    if (!isValid || !isValid.userId) {
      throw new ExpressError(401, "Invalid or Expired Token");
    }


    const user = await User.findById(isValid.userId)

    if (!user) {
      throw new ExpressError(401, "User no longer Exists");
    }


    (req as any).user = {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      isVerified: user.isVerified,
    };

    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message:"Unauthorized!",
    });
  }
};

export default VerifyAuth;
