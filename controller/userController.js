const express = require('express');
const app = express();
const {sendMail} = require('../nodeMailer');
const jwt = require('jsonwebtoken');
const JWT_KEY = 'heuiwyr8934y2quxi';
const cookieParser = require('cookie-parser');
//const userModel = require('../models/app');
const appExport = require('../models/app');
const userModel = appExport[0];
const cors = require('cors');
const allowedOrigins = ['http://192.168.216.71:5501', 'http://192.168.1.103:5501','http://192.168.1.104:5501','http://192.168.1.105:5501', 'http://192.168.1.100:5501',"http://192.168.1.107:5501", "http://192.168.1.99:5501", "http://192.168.1.109:5501"]; // for cookies always specify the domain 
const corsOptions = {
    origin: function(origin, callback) {
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());


module.exports.postSignUp=async function postSignUp(req, res) {
    try{
     let dataObj = req.body;
     let existingUser = await userModel.findOne({ email: dataObj.email });
         if (existingUser) {
             return res.status(400).json({ message: "Email already exists. Enter a new email." });
         }
     
     dataObj.firstLogin = true;
     let user = await userModel.create(dataObj);
     return res.json({
         message:"User created",
         data:user
     })
 
    }
    catch(err){
         res.json(err);
    } 
 }
 
module.exports.LoginUser= async function LoginUser(req, res) {
     try{
      
         let data = req.body;
         if(data.email){
             let user = await userModel.findOne({email:data.email});
          if(user){
             //const isPasswordCorrect = await bcrypt.compare(data.password, user.password); // Compare the plaintext password with the hashed password
             if(user.password == data.password){
                 const uid = user._id;
                // console.log(uid);
 
                 //console.log("test 1")

                 const token = jwt.sign({_id:uid}, JWT_KEY);
                 //console.log(token);
                 
                 res.cookie('token', token, {httpOnly:true,secure:false, 
                           sameSite: 'Lax' , path:'/'});
                
                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                res.header('Expires', '-1');
                res.header('Pragma', 'no-cache');
 
                // console.log("test2");
                 //console.log('Cookies after setting:', res.get('set-cookie'));
 
                     
                 const cookies  = req.cookies;
                 //console.log(cookies);
                 const isFirstLogin = user.firstLogin;
                 if (isFirstLogin) {
                     sendMail("login", user);
                     // Update the user's firstLogin field to false
                     user.firstLogin = false;
                     await user.save();
                    // console.log("First login email sent and user updated:", user);  // Debug log
                 } 
                 return res.json({
                     message :"user has logged in",
                     userDetails : data,
                     firstLogin: isFirstLogin
                 })
                 
             }
             else{
                 return res.json({
                     message:"wrong password"
                 })
             }
         }
         else{
             return res.json({
                 message:"User not found. Enter correct email or create your account first!"
             })
         }
     
     }else{
         return res.json({
             messsage :"Empty email field"
         })
     }
         }
     catch(err){
         console.log(err);
     }
 }
 
module.exports.checklogin= async function checklogin(req, res){
     if(req.cookies.token){
         let isVerified = jwt.verify(req.cookies.token,JWT_KEY )
         if(isVerified){
            const userId = isVerified._id;
          //  console.log("userId", userId);

            const user = await userModel.findById(userId);
           // console.log("user", user);
            if(user){
               // console.log("after line 134");
                const userName = user.name; // Extract the username
               // console.log("userName", userName);
                res.json({
                    message:"user has logged in",
                    data:userName
                })
            }
            
             
         }else{
             return res.json({
                 message:"Please login first."
             })
         }
     }else {
         return res.json({
             message:"Please login first."
         })
     }
 }

 module.exports.logout = function logout(req, res) {
    const token = req.cookies.token;
    //console.log('Token:', token); // Debug log
    if (token) {
        try {
            let isVerified = jwt.verify(token, JWT_KEY);
            //console.log('Token Verified:', isVerified); 
            if (isVerified) {
                res.clearCookie('token', '', {
                    httpOnly: true, 
                    secure: false, 
                    sameSite: 'Lax', 
                    path:'/', 
                    maxAge: 0
                });
                return res.json({message: "User logout successfully"});
            }
        } catch (err) {
            // If the token is not valid (e.g., expired), it will throw an error
            return res.json({message: "Invalid token, please login first."});
        }
    } 
    
    return res.json({message: "Please login first."});
}
 
module.exports.forgotPassword= async function forgotPassword(req, res){
     let {email, domain} = req.body;
     //console.log(email);
     try{
         const user = await userModel.findOne({email:email});
         if(user){
             const resetToken = user.createResetToken();
             console.log(resetToken);
              let resetPasswordLink = resetToken;
              user.resetToken = resetToken;
              await user.save();
              console.log(user.resetTokenExpiry); 
              let obj ={
                 resetPasswordLink:resetPasswordLink,
                 email:email
             }
             // send email to the user through nodemailer
             sendMail("resetpassword", obj, domain);
             return res.json({
                 message: 'Password reset email sent.'
             });
         }
         else{
             return res.json({
                 message:"Enter correct email."
             })
         }
     }catch(err){
         return res.json({
             message: err
         })
     }
 }
 
module.exports.resetPassword= async function resetPassword(req, res){
     try{
         let {password, confirmPassword, token} = req.body;
         console.log("from frontend",password,confirmPassword,token);
         const user = await userModel.findOne({resetToken:token});
          console.log(user);
         if(user){

            // Check if the token has expired
            if (Date.now() > user.resetTokenExpiry) {
                return res.json({
                    message: "This link has expired now."
                });
            }
              // to reset user password in DB
             user.resetPasswordHandler(password, confirmPassword);   
             await user.save();
             return res.json({message:"credentials updated successfully"}); 
         }
         else{
             return res.json({
                 message:"Link has expired now"
             })
         }
     }
     catch(err){
         res.json({
             message:err.message
         })
     }
     
 }



