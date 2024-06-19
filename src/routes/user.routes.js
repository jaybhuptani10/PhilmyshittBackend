import {Router} from 'express';

import { loginUser, logoutUser, registerUser, userProfile } from '../controllers/user.controller.js';

const userRouter = Router();
userRouter.route('/register').post(registerUser);
userRouter.route('/login').post(loginUser);
userRouter.route('/logout').post(logoutUser);
userRouter.route('/profile').get(userProfile)

export default userRouter;
