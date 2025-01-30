import {Router} from 'express';

import { loginUser, logoutUser, registerUser, userProfile, validateToken } from '../controllers/user.controller.js';
import { addMovieToUser, addReviews, deleteReview, getAddedDetails, getReviews } from '../controllers/movie.controller.js';

const userRouter = Router();
userRouter.route('/register').post(registerUser);
userRouter.route('/login').post(loginUser);
userRouter.route('/logout').post(logoutUser);
userRouter.route('/profile').get(userProfile);
userRouter.route('/validateToken').get(validateToken);
userRouter.route('/addMovieToUser').post(addMovieToUser);
userRouter.route('/getAddedDetails').get(getAddedDetails);
userRouter.route('/addReviews').post(addReviews);
userRouter.route('/getReviews').get(getReviews);
userRouter.route('/deleteReview').post(deleteReview);
export default userRouter;
