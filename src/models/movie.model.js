import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true }, // To display user’s name
    rating: { type: Number, min: 0, max: 5, required: true },
    reviewText: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  });
  

const movieSchema = new mongoose.Schema({
    movieId: { type: String, required: true, unique: true },  // TMDB ID or custom ID
    title: { type: String, required: true }, // Movie title
    users: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        watched: { type: Boolean, default: false },
        liked: { type: Boolean, default: false },
        stars: { type: Number, min: 0, max: 5, default: 0 },
      },
    ],
    reviews: [reviewSchema], // Store all user reviews for this movie
    
    
}, { timestamps: true });

const movieModel = mongoose.model("Movie", movieSchema);
export default movieModel;
