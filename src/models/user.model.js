import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    watchedMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    likedMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    watchlistMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    friends:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    
}, { timestamps: true });

const userModel = mongoose.model("User", userSchema);   
export default userModel;