import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    watchedList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie"
    }],
    friends:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    
}, { timestamps: true });

const userModel = mongoose.model("User", userSchema);   
export default userModel;