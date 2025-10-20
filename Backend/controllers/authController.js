import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../model/User.js";

import {generateTokens} from '../utils/token.js';

import sendEmail from '../utils/sendEmail.js';

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
        await user.save(); // This saves both password (hashed via pre-save) and verificationToken

        return res.status(200).json("user Created Succefully");
    }
    catch(error){
        console.error("SignUp Error", error.message);
        return res.status(500).json({message: "server Error Please Try again Later"});
    }
};

export const login = (req, res) => {
  res.status(200).json({ message: "Login successful!" });
};

export const logout = (req, res) => {
  res.status(200).json({ message: "User logged out!" });
};
