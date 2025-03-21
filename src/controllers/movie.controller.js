import asyncHandler from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { userModel, UserMediaInteraction } from "../models/user.model.js";

/**
 * Add or update movie details for a user
 */
export const addMovieToUser = asyncHandler(async (req, res) => {
  const { userEmail, movieId, title, watched, liked, stars, watchlisted } =
    req.body;

  if (!userEmail || !movieId || !title) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const user = await userModel.findOne({ email: userEmail });
  if (!user) return res.status(404).json({ message: "User not found" });

  let movie = await movieModel.findOne({ movieId });

  if (!movie) {
    // If movie doesn't exist, create a new movie entry
    movie = new movieModel({ movieId, title, users: [] });
  }

  // Check if user already has an entry for this movie
  const existingUserData = movie.users.find((u) => u.userId.equals(user._id));

  if (existingUserData) {
    // Update existing user entry
    existingUserData.watched = watched;
    existingUserData.liked = liked;
    existingUserData.stars = stars;
    existingUserData.watchlisted = watchlisted;
  } else {
    // Add new entry for this user
    movie.users.push({ userId: user._id, watched, liked, stars, watchlisted });
  }

  await movie.save();

  // ✅ Handle Watched Movies:
  if (watched) {
    if (!user.watchedMovies.includes(movie._id)) {
      user.watchedMovies.push(movie._id);
    }
    // Remove from watchlist if it's there
    user.watchlistMovies = user.watchlistMovies.filter(
      (id) => !id.equals(movie._id)
    );
  } else {
    // If watched is false, remove from watchedMovies and also remove from likedMovies
    user.watchedMovies = user.watchedMovies.filter(
      (id) => !id.equals(movie._id)
    );
    user.likedMovies = user.likedMovies.filter((id) => !id.equals(movie._id)); // Remove from likedMovies
  }

  // ✅ Handle Watchlist Movies:
  if (watchlisted) {
    if (!user.watchlistMovies.includes(movie._id)) {
      user.watchlistMovies.push(movie._id);
    }
    // Remove from watched list if it's there
    user.watchedMovies = user.watchedMovies.filter(
      (id) => !id.equals(movie._id)
    );
    user.likedMovies = user.likedMovies.filter((id) => !id.equals(movie._id)); // Ensure likedMovies is cleared if moved to watchlist
  } else {
    // If watchlisted is false, remove from watchlistMovies
    user.watchlistMovies = user.watchlistMovies.filter(
      (id) => !id.equals(movie._id)
    );
  }

  // ✅ Handle Liked Movies:
  if (liked && watched) {
    // A movie can only be liked if it's watched
    if (!user.likedMovies.includes(movie._id)) {
      user.likedMovies.push(movie._id);
    }
  } else {
    user.likedMovies = user.likedMovies.filter((id) => !id.equals(movie._id));
  }

  await user.save();

  res.status(200).json({ message: "Movie data updated successfully", movie });
});

/**
 * Get movie details added by a user
 */
export const getAddedDetails = asyncHandler(async (req, res) => {
  const { userEmail, movieId } = req.query;

  if (!userEmail || !movieId) {
    return res
      .status(400)
      .json({ message: "Missing required query parameters" });
  }

  const user = await userModel.findOne({ email: userEmail });
  if (!user) return res.status(404).json({ message: "User not found" });

  const movie = await movieModel.findOne({ movieId });
  if (!movie) return res.status(404).json({ message: "Movie not found" });

  const userMovieData = movie.users.find((u) => u.userId.equals(user._id));

  if (!userMovieData) {
    return res.status(404).json({
      message: "Movie not added for this user",
      watched: false,
      liked: false,
      stars: 0,
    });
  }

  res.status(200).json({ movie: userMovieData });
});

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
  try {
    const { userId } = req.body;
    const { mediaType, tmdbId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    let interaction = await UserMediaInteraction.findOne({
      userId,
      tmdbId,
      mediaType,
    });

    if (!interaction) {
      interaction = new UserMediaInteraction({
        userId,
        tmdbId,
        mediaType,
        liked: { status: true, date: new Date() },
        watched: { status: true, date: new Date() }, // Auto-enable watched
        watchlisted: { status: false, date: null }, // Disable watchlisted
      });
    } else {
      interaction.liked.status = !interaction.liked.status;
      interaction.liked.date = interaction.liked.status ? new Date() : null;

      if (interaction.liked.status) {
        interaction.watched.status = true; // Automatically enable watched
        interaction.watched.date = new Date();
        interaction.watchlisted.status = false; // Disable watchlisted
        interaction.watchlisted.date = null;
      }
    }

    await interaction.save();
    res.json({ success: true, liked: interaction.liked.status });
  } catch (error) {
    console.error("Error in likedStatus:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export const watchlistStatus = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.body;
    const { mediaType, tmdbId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    let interaction = await UserMediaInteraction.findOne({
      userId,
      tmdbId,
      mediaType,
    });

    if (!interaction) {
      interaction = new UserMediaInteraction({
        userId,
        tmdbId,
        mediaType,
        watchlisted: { status: true, date: new Date() },
        watched: { status: false, date: null }, // Disable watched
        liked: { status: false, date: null }, // Disable liked
      });
    } else {
      interaction.watchlisted.status = !interaction.watchlisted.status;
      interaction.watchlisted.date = interaction.watchlisted.status
        ? new Date()
        : null;

      if (interaction.watchlisted.status) {
        interaction.watched.status = false; // Disable watched
        interaction.watched.date = null;
        interaction.liked.status = false; // Disable liked
        interaction.liked.date = null;
      }
    }

    await interaction.save();
    res.json({ success: true, watchlisted: interaction.watchlisted.status });
  } catch (error) {
    console.error("Error in watchlistStatus:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export const watchStatus = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.body;
    const { mediaType, tmdbId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    let interaction = await UserMediaInteraction.findOne({
      userId,
      tmdbId,
      mediaType,
    });

    if (!interaction) {
      interaction = new UserMediaInteraction({
        userId,
        tmdbId,
        mediaType,
        watched: { status: true, date: new Date() },
        watchlisted: { status: false, date: null }, // Disable watchlisted
      });
    } else {
      interaction.watched.status = !interaction.watched.status;
      interaction.watched.date = interaction.watched.status ? new Date() : null;

      if (interaction.watched.status) {
        interaction.watchlisted.status = false; // Disable watchlisted
        interaction.watchlisted.date = null;
      }
    }

    await interaction.save();
    res.json({ success: true, watched: interaction.watched.status });
  } catch (error) {
    console.error("Error in watchStatus:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export const userList = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.body; // Extract userId from request body

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    // Fetch user interactions sorted by date
    const watched = await UserMediaInteraction.find({
      userId,
      "watched.status": true,
    })
      .sort({ "watched.date": -1 })
      .select("tmdbId mediaType");

    const liked = await UserMediaInteraction.find({
      userId,
      "liked.status": true,
    })
      .sort({ "liked.date": -1 })
      .select("tmdbId mediaType");

    const watchlist = await UserMediaInteraction.find({
      userId,
      "watchlisted.status": true,
    })
      .sort({ "watchlisted.date": -1 })
      .select("tmdbId mediaType");

    const rated = await UserMediaInteraction.find({
      userId,
      "rating.score": { $ne: null },
    })
      .sort({ "rating.date": -1 })
      .select("tmdbId mediaType rating.score");

    res.json({
      watched,
      liked,
      watchlist,
      rated,
    });
  } catch (error) {
    console.error("Error in userList:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get detailed information about a specific user-media interaction
export const checkData = asyncHandler(async (req, res) => {
  try {
    const { userId, mediaType, tmdbId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const interaction = await UserMediaInteraction.findOne({
      userId,
      tmdbId: Number(tmdbId),
      mediaType,
    });

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
