import jwt from "jsonwebtoken";

import User from "../model/User.js";

import {verifyToken} from '../utils/token.js';

const isAuth = async(req , res , next) =>{
    try{
        const token = req.cookies?.token;

        if(!token){
            return res.status(401).json({message: "No Token available . Login Again"});
        }

        const decode = verifyToken(token, process.env.JWT_ACCESS_SECRET);

        const user = await User.findById(decode.userId).select("-password");

        if(!user){
            return res.status(404).json({message : "user is Not found"});
        }

        req.userId = decode.userId;

        req.user = user;

        next();
    }
    catch(error){
        return res.status(500).json({message: `Authentication Error: ${error.message}`});
    }
};

export default isAuth;