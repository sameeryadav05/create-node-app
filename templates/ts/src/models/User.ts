import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  mobile?: number;
  isVerified: boolean;
  otp?: number;
  otpExp?: Date;
}

const userSchema = new Schema<IUser>({
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

const User = mongoose.model<IUser>("User", userSchema);

export default User;
