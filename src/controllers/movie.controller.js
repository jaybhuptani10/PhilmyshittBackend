import asyncHandler from "../utils/asynchandler.js";

import { userModel } from "../models/user.model.js";

/**
 * Add or update movie details for a user
 */

/**
 * Get movie details added by a user
 */

/**
 * Add or update a movie review
 */
export const addReviews = asyncHandler(async (req, res) => {
  const { userEmail, movieId, rating, reviewText } = req.body;

  if (!userEmail || !movieId || rating === undefined || !reviewText) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const user = await userModel.findOne({ email: userEmail });
  if (!user) return res.status(404).json({ message: "User not found" });

  let movie = await movieModel.findOne({ movieId });
  if (!movie) return res.status(404).json({ message: "Movie not found" });

  // Check if user already reviewed this movie
  const existingReview = movie.reviews.find((r) => r.userId.equals(user._id));

  if (existingReview) {
    // Update existing review
    existingReview.rating = rating;
    existingReview.reviewText = reviewText;
    existingReview.createdAt = Date.now();
  } else {
    // Add new review
    movie.reviews.push({
      userId: user._id,
      username: user.name,
      rating,
      reviewText,
    });
  }

  await movie.save();
  res.status(200).json({ message: "Review added successfully", movie });
});

/**
 * Get all reviews for a movie
 */
export const getReviews = asyncHandler(async (req, res) => {
  const { movieId } = req.query;

  if (!movieId) {
    return res.status(400).json({ message: "Movie ID is required" });
  }

  const movie = await movieModel.findOne({ movieId });

  if (!movie) return res.status(404).json({ message: "Movie not found" });

  res.status(200).json({ reviews: movie.reviews });
});

/**
 * Delete a user's review for a movie
 */
export const deleteReview = asyncHandler(async (req, res) => {
  const { userEmail, movieId } = req.body;

  if (!userEmail || !movieId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const user = await userModel.findOne({ email: userEmail });
  if (!user) return res.status(404).json({ message: "User not found" });

  let movie = await movieModel.findOne({ movieId });
  if (!movie) return res.status(404).json({ message: "Movie not found" });

  // Filter out the review that belongs to the user
  const updatedReviews = movie.reviews.filter(
    (r) => !r.userId.equals(user._id)
  );

  if (updatedReviews.length === movie.reviews.length) {
    return res.status(404).json({ message: "Review not found" });
  }

  movie.reviews = updatedReviews;
  await movie.save();

  res.status(200).json({ message: "Review deleted successfully", movie });
});

export const likedStatus = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const { mediaType, tmdbId } = req.params;

  const user = await userModel.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const interaction = user.mediaInteractions.find(
    (i) => i.tmdbId === Number(tmdbId) && i.mediaType === mediaType
  );

  if (interaction) {
    interaction.liked.status = !interaction.liked.status;
    interaction.liked.date = interaction.liked.status ? new Date() : null;
  } else {
    user.mediaInteractions.push({
      tmdbId,
      mediaType,
      liked: { status: true, date: new Date() },
      watched: { status: true, date: new Date() },
    });
  }

  await user.save();
  res.json({ success: true, liked: interaction?.liked.status || true });
});

export const watchlistStatus = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const { mediaType, tmdbId } = req.params;

  const user = await userModel.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const interaction = user.mediaInteractions.find(
    (i) => i.tmdbId === Number(tmdbId) && i.mediaType === mediaType
  );

  if (interaction) {
    interaction.watchlisted.status = !interaction.watchlisted.status;
    interaction.watchlisted.date = interaction.watchlisted.status
      ? new Date()
      : null;
  } else {
    user.mediaInteractions.push({
      tmdbId,
      mediaType,
      watchlisted: { status: true, date: new Date() },
      watched: { status: false, date: null },
      liked: { status: false, date: null },
    });
  }

  await user.save();
  res.json({
    success: true,
    watchlisted: interaction?.watchlisted.status || true,
  });
});

export const watchStatus = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const { mediaType, tmdbId } = req.params;

  const user = await userModel.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const interaction = user.mediaInteractions.find(
    (i) => i.tmdbId === Number(tmdbId) && i.mediaType === mediaType
  );

  if (interaction) {
    interaction.watched.status = !interaction.watched.status;
    interaction.watched.date = interaction.watched.status ? new Date() : null;
  } else {
    user.mediaInteractions.push({
      tmdbId,
      mediaType,
      watched: { status: true, date: new Date() },
      watchlisted: { status: false, date: null },
    });
  }

  await user.save();
  res.json({ success: true, watched: interaction?.watched.status || true });
});

export const userList = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await userModel.findById(userId).lean();
  if (!user) return res.status(404).json({ message: "User not found" });

  const watched = user.mediaInteractions.filter((i) => i.watched.status);
  const liked = user.mediaInteractions.filter((i) => i.liked.status);
  const watchlisted = user.mediaInteractions.filter(
    (i) => i.watchlisted.status
  );

  res.json({ watched, liked, watchlisted });
});

// Get detailed information about a specific user-media interaction
export const checkData = asyncHandler(async (req, res) => {
  try {
    const { userId, mediaType, tmdbId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const interaction = user.mediaInteractions.find(
      (i) => i.tmdbId === Number(tmdbId) && i.mediaType === mediaType
    );

    if (!interaction) {
      return res.json({
        watched: false,
        liked: false,
        watchlisted: false,
        rating: null,
        watchProgress: 0,
      });
    }

    res.json({
      watched: interaction.watched.status || false,
      liked: interaction.liked.status || false,
      watchlisted: interaction.watchlisted.status || false,
      rating: interaction.rating.score,
      watchProgress: interaction.watchProgress,
      lastWatched: interaction.lastWatched,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export const rateMovie = asyncHandler(async (req, res) => {
  const { userId, tmdbId, mediaType, rating } = req.body;

  const user = await userModel.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const interaction = user.mediaInteractions.find(
    (i) => i.tmdbId === Number(tmdbId) && i.mediaType === mediaType
  );

  if (interaction) {
    interaction.rating = {
      score: rating,
      date: new Date(),
    };
  } else {
    user.mediaInteractions.push({
      tmdbId,
      mediaType,
      rating: {
        score: rating,
        date: new Date(),
      },
      watched: {
        status: true,
        date: new Date(),
      },
    });
  }

  await user.save();
  res.json({
    success: true,
    message: "Rating updated successfully",
    userRating: rating,
  });
});

/**
 * Get average rating for a movie
 */
export const getMovieRating = asyncHandler(async (req, res) => {
  try {
    const { tmdbId, mediaType } = req.params;
    let { userId } = req.query;

    console.log("Received Request: ", { tmdbId, mediaType, userId });

    if (!tmdbId || !mediaType) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    // Fetch all users with ratings for this movie
    const usersWithRatings = await userModel.find({
      "mediaInteractions.tmdbId": Number(tmdbId),
      "mediaInteractions.mediaType": mediaType,
      "mediaInteractions.rating.score": { $gt: 0 },
    });

    if (!usersWithRatings.length) {
      return res.json({
        averageRating: 0,
        totalRatings: 0,
        userRating: null,
      });
    }

    // Calculate average rating
    let totalScore = 0;
    let totalRatings = 0;

    usersWithRatings.forEach((user) => {
      const interaction = user.mediaInteractions.find(
        (i) => i.tmdbId === Number(tmdbId) && i.mediaType === mediaType
      );
      if (interaction && interaction.rating.score) {
        totalScore += interaction.rating.score;
        totalRatings++;
      }
    });

    const averageRating = totalScore / totalRatings;

    // Find the user's rating (if they have rated)
    let userRating = null;
    if (userId) {
      const user = await userModel.findById(userId);
      if (user) {
        const interaction = user.mediaInteractions.find(
          (i) => i.tmdbId === Number(tmdbId) && i.mediaType === mediaType
        );
        if (interaction && interaction.rating.score) {
          userRating = interaction.rating.score;
        }
      }
    }

    console.log("Final Response:", {
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalRatings,
      userRating,
    });

    res.json({
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalRatings,
      userRating,
    });
  } catch (error) {
    console.error("Error in getMovieRating:", error);
    res.status(500).json({ message: "Server error" });
  }
});
