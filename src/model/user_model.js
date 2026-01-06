import mongoose from "mongoose";
import bcrypt from "bcrypt";

const validEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validPassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

const userSchema = new mongoose.Schema(
  {
   name: {
  type: String,
    trim: true,  
  required: true,
  default: "User",
  set: v => v === "" ? "User" : v
},


    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      lowercase: true,
      validate: [validEmail, "Invalid Email"],
    },

    password: {
      type: String,
      required: true,
      validate: [
        validPassword,
        "Password must contain uppercase, lowercase, number & special character",
      ],
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    userOtp: {
      type: Number,
      default: null,
    },

    otpExpire: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});


export default mongoose.model("User", userSchema);
