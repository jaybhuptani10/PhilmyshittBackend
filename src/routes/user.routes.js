import { Router } from "express";

import {
  loginUser,
  logoutUser,
  registerUser,
  userProfile,
  validateToken,
} from "../controllers/user.controller.js";
import {
  addMovieToUser,
  addReviews,
  deleteReview,
  getAddedDetails,
  getReviews,
  likedStatus,
  userList,
  watchlistStatus,
  watchStatus,
} from "../controllers/movie.controller.js";

const userRouter = Router();
userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(logoutUser);
userRouter.route("/profile").get(userProfile);
userRouter.route("/validateToken").get(validateToken);
userRouter.route("/addMovieToUser").post(addMovieToUser);
userRouter.route("/getAddedDetails").get(getAddedDetails);
userRouter.route("/addReviews").post(addReviews);
userRouter.route("/getReviews").get(getReviews);
userRouter.route("/deleteReview").post(deleteReview);
userRouter.route("/media/:mediaType/:tmdbId/watched").post(watchStatus);
userRouter.route("/media/:mediaType/:tmdbId/like").post(likedStatus);
userRouter.route("/media/:mediaType/:tmdbId/watchlist").post(watchlistStatus);
userRouter.route("/media/lists").get(userList);
export default userRouter;
