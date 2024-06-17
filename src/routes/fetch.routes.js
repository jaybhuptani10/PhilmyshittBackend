import {Router} from 'express';
import { fetchDataFromApi, getMovieInfo } from '../controllers/fetchDataFromApi.js';

const fetchRouter = Router();
fetchRouter.route('/fetch').get(fetchDataFromApi);
fetchRouter.route('/search').get(getMovieInfo);
export default fetchRouter;