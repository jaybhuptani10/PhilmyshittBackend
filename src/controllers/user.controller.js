import asyncHandler from "../utils/asynchandler.js";
import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/apiresponse.js";
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please fill all the fields");
    }
    const existedUser = await userModel.findOne({
        $or : [{email}]
    })
    if(existedUser){
       // alert("User already exists");
        return res.status(400).json({
            success: false,
            message: "User already exists"
        })
    }
    const newUser = await userModel.create({
        name,
        email,
        password: bcrypt.hashSync(password, 10)
    });
    const createdUser = await  userModel.findById(newUser._id).select(
        "-password -refreshToken"
    );
    if (!createdUser){
        return res.status(500).json({
            success: false,
            message: "Failed to create user"
        })
    }
    return res.status(201).json(
        //alert("User created successfully"),
        new ApiResponse(true,"User created successfully",createdUser)
    )
});
const loginUser= asyncHandler(async (req,res)=>{
    const {email,password} = req.body;
    if (!email || !password){
        res.status(400);
        throw new Error("Please fill all the fields");  
    }
    const userDoc = await userModel.findOne({email});
    if (userDoc){
        const pass = bcrypt.compareSync(password,userDoc.password);
        if (pass){
            jwt.sign({email: userDoc.email, id: userDoc._id , name: userDoc.name}, process.env.JWT_SECRET, {expiresIn: "1d"},(err,token)=>{
                if (err) throw err;
                res.cookie('token',token).json(userDoc);
                }
                
            );
        }else{
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            })
        }
    }
});
const logoutUser = asyncHandler(async (req,res)=>{
    res.clearCookie('token').json({
        message: "Logged out successfully"
    });
});
export {logoutUser};
export {loginUser};
export {registerUser};