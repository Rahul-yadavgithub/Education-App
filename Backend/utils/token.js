import jwt from "jsonwebtoken";

/*
“This function securely generates two JWT tokens — one short-term (accessToken) and one long-term (refreshToken).
You must give it a data object (like { id, role }), and it will return an object containing both tokens.
*/ 

// Token has three pare : HEADER.PAYLOAD.SIGNATURE
// Header -> { "alg": "HS512", "typ": "JWT" } which kind of algo used and what is type 
// payload -> { "id": 123, "role": "admin" }


const generateTokens = (payload) =>{

  try{
    // Access Token — short-lived, used for API calls

    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET , {
      expiresIn: "15m", // 15 minutes for better protection
      algorithm: "HS512", // stronger signing algorithm
    });

    // Refresh Token — long-lived, stored securely (e.g., HTTP-only cookie)

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET , {
       expiresIn: "7d", // can be refreshed periodically
       algorithm: "HS512",
    });

    return {accessToken, refreshToken};
  }
  catch(error){
    console.error("Error in Generating the Token: ", error.message);
    throw new Error("Token Generation Failed");

  }
};

// Now for the verification of the JWT token 

const verifyToken = (token, secret) =>{
  try{
    return jwt.verify(token, secret);
  }
  catch(error){
    console.log("Invalid Token: ", error.message);
    return null;
  }
};


const refreshAccessToken = (refreshToken) =>{
  try{
    const decode = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = jwt.sign(
      {id: decode._id},
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn : "15m",
        algorithm : "HS512",
      }
    );

    return newAccessToken;
  }
  catch(error){
   if (error.name === "TokenExpiredError") {
      console.error(" Refresh token expired");
    } else {
      console.error(" Refresh token invalid:", error.message);
    }
    return null;
  }
};

export { generateTokens, verifyToken, refreshAccessToken };