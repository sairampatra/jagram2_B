import mongoose from "mongoose";
import bcrypt from 'bcrypt';  // Import bcrypt

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    bio: { type: String, default: "" },
    gender: { type: String, enum: ["male", "female", "others"] },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

userSchema.pre('save',function modifyPassword(next){
    const user = this
    if (!user.password || !user.isModified("password")) {
      return next();
    }
  
   
try {
  const SALT = bcrypt.genSaltSync(9)
    const hashedPassword = bcrypt.hashSync(user.password,SALT)
    user.password = hashedPassword
next()
} catch (error) {
  console.error("Error hashing password:", error); // Log error for debugging
  next(error); // Pass error to Express (prevents app from breaking)
}
})

export const User = mongoose.model("User", userSchema);
