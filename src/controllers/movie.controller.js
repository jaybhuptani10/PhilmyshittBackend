import asyncHandler from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/apiresponse.js";
import userModel from "../models/user.model.js";
import movieModel from "../models/movie.model.js";
export const addMovieToUser = async (req, res) => {
    const { movieId, userEmail, stars, liked, reviews, watchlisted } = req.body;
    if (!movieId || !userEmail) {
        return res.status(400).json({
            success: false,
            message: "Movie ID or userEmail not provided"
        });
    }
    try {
        const user = await userModel.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        let movie = await movieModel.findOne({ movieid: movieId, owner: user._id });

        if (movie) {
            movie.liked = liked;
            movie.stars = stars;
            movie.reviews = reviews;
            movie.watchlisted = watchlisted;
            await movie.save();
            return res.status(200).json({
                success: true,
                message: "Movie status updated",
                movie
            });
        }

        const newMovie = await movieModel.create({
            owner: user._id,
            movieid: movieId,
            stars: stars,
            liked: liked,
            reviews: reviews,
            watchlisted: watchlisted
        });

        if (!newMovie) {
            return res.status(500).json({
                success: false,
                message: "Movie not added"
            });
        }

        user.watchedList.push(newMovie._id);
        await user.save();

        return res.status(201).json({
            success: true,
            message: "Movie data added successfully",
            data: newMovie
        });

    } catch (error) {
        console.error("Error adding movie to user:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

export const getMovieDetails = async (req, res) => {
    const { movieId, userId } = req.query;
    if (!movieId || !userId) {
        return res.status(400).json({
            success: false,
            message: "Movie ID or User ID not provided"
        });
    }
    try {
        const movie = await movieModel.findOne({ movieid: movieId, owner: userId });
        if (!movie) {
            return res.status(404).json({
                success: false,
                message: "Movie not found"
            });
        }
        res.status(200).json({
            success: true,
            movie
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};