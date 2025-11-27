import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
    select: false,
  },

  mobile: {
    type: Number,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  otp: {
    type: Number,
  },

  otpExp: {
    type: Date,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
