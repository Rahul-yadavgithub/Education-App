import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../model/User.js";

import {generateTokens} from '../utils/token.js';

import sendEmail from '../utils/sendEmail.js';

import {verifyEmailTemplate} from '../utils/EmailTemplate/verifyEmailTemplate.js';
import {resetPasswordTemplate} from '../utils/EmailTemplate/resetPasswordTemplate.js';

import dotenv from 'dotenv';

dotenv.config();
// Signup Code 


export const signUp = async(req, res) =>{

    const {name, email, password,profileImageUrl} = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try{

        const userExit = await User.findOne({email});
        if(userExit){
            return res.status(400).json({message: "User is Already Exit"});
        }

       const user = new User({
          name,
          email,
          password,
          profileImageUrl,
        });

        const verificationToken = user.generateVerificationToken();

        await user.save(); 
        
        const verifyUrl = `${process.env.CLIENT_URL}/verify/${verificationToken}`;

        const message = verifyEmailTemplate(verifyUrl, name);
          
        await sendEmail(email, "Email Verification", message);

       return res.json({message : "Verification Email sent . Please Check Your Inbox"});
    }
    catch(error){
        console.error("SignUp Error", error.message);
        return res.status(500).json({message: "server Error Occured"});
    }
}

// For the Verification with the help of Email 

export const verifyEmail = async(req, res) =>{
  const {token} = req.params;

  const user =  await User.findOne({verificationToken : token});

  if(!user){
    return res.status(400).json({message : "Invalid or Expire Token"});
  }

  user.isVerified = true;
  
  user.verificationToken = undefined;

  await user.save();

  return res.status(200).json("Email is Verified Successfully");

}

export const login = async(req, res) => {

  const {email, password} = req.body;

  if(!email || !password){
    return res.status(400).json({message: "All Feild are required"});
  }
  try{

    const userExit = await User.findOne({email}).select("+password");

    if(!userExit){
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if(!userExit.isVerified){
      return res.status(400).json({message : "please Verify Your Email First"});
    }

    const ismatch = await userExit.comparePassword(password);

    if(!ismatch){
     return res.status(400).json({ message: "Invalid email or password" });
    }

    const {accessToken, refreshToken} = generateTokens({id : userExit._id});

    return res.cookie("refreshToken", refreshToken, {
      httpOnly : true,
      secure : process.env.NODE_ENVIRONMENT === "production",
      sameSite : "Strict",
      maxAge :  7 * 24 * 60 * 60 * 1000, // 7 days
    }).json({message : "login Successfully", accessToken});
  }
  catch(error){
     console.error("Login Error:", error);
     res.status(500).json({ message: "Server error" });
  }

};

export const forgotPassword = async(req, res)=>{
  const {email} = req.body;

  if(!email){
    return res.status(400).json({message : "Please Enter Email"});
  }

  try{
    const user = await  User.findOne({email});
    if(!user){
      return res.status(400).json({message: "User is Not Found"});
    }

    const resetToken = user.generatePasswordResetToken();

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset/${resetToken}`;

    const message = resetPasswordTemplate(resetUrl, user.name);

    await sendEmail(email, "Reset Password ", message);

    return res.json({message : "Password reset email sent"});
  }
  catch(error){
    console.error("Reset Password : ", error.message);
    return res.status(500).json({message: "server Error Occured"});

  }
};

export const resetPassword = async(req, res) =>{

  const {token} = req.params;

  const {password} = req.body;

  if(!password){
    return res.json({message : "please Enter 8 Digit Password"});
  }

  try{
    const hashToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken : hashToken, 
      resetPasswordExpire : { $gt: Date.now() 
      }});

      if(!user){
        return res.status(400).json({message: "Invalid or Expired Token"});
      };

      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return res.json({message : "Password reset successful"});
  }
  catch(error){
    console.error("Password is not Changed :", error.message);
    return res.status(500).json({message : "Server Side Error "});
  }


}

export const logout = (req, res) => {
  res.status(200).json({ message: "User logged out!" });
};
