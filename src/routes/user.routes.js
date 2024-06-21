import {Router} from 'express';

import { loginUser, logoutUser, registerUser, userProfile } from '../controllers/user.controller.js';
import { addMovieToUser } from '../controllers/movie.controller.js';

const userRouter = Router();
userRouter.route('/register').post(registerUser);
userRouter.route('/login').post(loginUser);
userRouter.route('/logout').post(logoutUser);
userRouter.route('/profile').get(userProfile);
userRouter.route('/addMovieToUser').post(addMovieToUser);
export default userRouter;
