import User from "../models/User.js";
import { hashPassword } from "../utils/bcrypt.js";
import ExpressError from "../utils/ExpressError.js";
import sendMail from "../utils/SendEmail.js";
import WrapAsync from "../utils/WrapAsync.js";

export const signup = WrapAsync(async (req, res) => {
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
    otpExp: Date.now() + 5 * 60 * 1000, // 5 min expiry
  });

  await sendMail(otp, email);

  res.status(201).json({
    success: true,
    message: "6 digits verification code is sent to email",
  });
});
