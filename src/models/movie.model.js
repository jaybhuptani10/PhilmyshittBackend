import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    reviews: {
        type: String,
    },
    movieid: {
        type: String,
        required: true
    },
    
    liked: {
        type: Boolean,
        default: false
    },
    stars: {
        type: Number,
        default: 0
    },
    watchlisted:{
        type: Boolean,
        default: false
    },
    title: {
        type:String
    }
    
}, { timestamps: true });

const movieModel = mongoose.model("Movie", movieSchema);
export default movieModel;
