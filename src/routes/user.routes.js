import { Router } from "express";
import multer from "multer";

import {
  loginUser,
  logoutUser,
  registerUser,
  userProfile,
  validateToken,
  uploadProfilePicture,
} from "../controllers/user.controller.js";
import {
  addReviews,
  checkData,
  deleteReview,
  getMovieRating,
  getReviews,
  likedStatus,
  rateMovie,
  userList,
  watchlistStatus,
  watchStatus,
} from "../controllers/movie.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const upload = multer({ dest: "uploads/" }); // Temporary storage for uploaded files

const userRouter = Router();
userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(logoutUser);

userRouter.route("/profile").get(authMiddleware, userProfile);

userRouter.route("/addReviews").post(authMiddleware, addReviews);
userRouter.route("/getReviews").get(authMiddleware, getReviews);
userRouter.route("/deleteReview").post(authMiddleware, deleteReview);
userRouter
  .route("/media/:mediaType/:tmdbId/watched")
  .post(authMiddleware, watchStatus);
userRouter
  .route("/media/:mediaType/:tmdbId/like")
  .post(authMiddleware, likedStatus);
userRouter
  .route("/media/:mediaType/:tmdbId/watchlist")
  .post(authMiddleware, watchlistStatus);
userRouter.route("/media/lists").get(authMiddleware, userList);
userRouter.route("/media").get(authMiddleware, checkData);
userRouter.route("/rate").post(authMiddleware, rateMovie);
userRouter
  .route("/rating/:mediaType/:tmdbId")
  .get(authMiddleware, getMovieRating);
userRouter
  .route("/profile/upload-picture")
  .post(authMiddleware, upload.single("profilePicture"), uploadProfilePicture);

export default userRouter;
