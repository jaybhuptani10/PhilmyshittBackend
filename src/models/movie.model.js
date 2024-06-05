import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User", 
    },
    reviews:{
        type:string
    }
}, { timestamps: true });