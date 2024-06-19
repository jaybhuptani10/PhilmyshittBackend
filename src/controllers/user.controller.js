import asyncHandler from "../utils/asynchandler.js";
import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/apiresponse.js";

// Register User
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please fill all the fields");
    }
    const existedUser = await userModel.findOne({ $or: [{ email }] });
    if (existedUser) {
        return res.status(400).json({
            success: false,
            message: "User already exists"
        });
    }
    const newUser = await userModel.create({
        name,
        email,
        password: bcrypt.hashSync(password, 10)
    });
    const createdUser = await userModel.findById(newUser._id).select(
        "-password -refreshToken"
    );
    if (!createdUser) {
        return res.status(500).json({
            success: false,
            message: "Failed to create user"
        });
    }
    return res.status(201).json(
        new ApiResponse(true, "User created successfully", createdUser)
    );
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("Please fill all the fields");
    }
    const userDoc = await userModel.findOne({ email });
    if (userDoc) {
        const pass = bcrypt.compareSync(password, userDoc.password);
        if (pass) {
            jwt.sign({ email: userDoc.email, id: userDoc._id, name: userDoc.name }, process.env.JWT_SECRET, { expiresIn: "1d" }, (err, token) => {
                if (err) throw err;
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', // Set secure to true in production
                    sameSite: 'None' // Required for cross-site cookies
                }).json(userDoc);
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }
    }
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None'
    }).json({
        message: "Logged out successfully"
    });
});

// User Profile
const userProfile = asyncHandler(async (req, res) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Not authorized, token missing"
            });
        }
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userDoc) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: "Not authorized, token invalid",
                    error: err.message
                });
            }
            const user = await userModel.findById(userDoc.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }
            const { name, email, id } = user;
            res.json({ name, email, id });
        });
    } catch (e) {
        console.error('Server error:', e);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: e.message
        });
    }
});

export { logoutUser, loginUser, userProfile, registerUser };
