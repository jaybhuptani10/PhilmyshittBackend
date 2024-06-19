import {Router} from 'express';
import { fetchDataFromApi, getMovieInfo, getSearchedMovie, getSeriesInfo } from '../controllers/fetchDataFromApi.js';

const fetchRouter = Router();
fetchRouter.route('/fetch').get(fetchDataFromApi);
fetchRouter.route('/moviedetails').get(getMovieInfo);
fetchRouter.route('/seriesdetails').get(getSeriesInfo);
fetchRouter.route('/search').get(getSearchedMovie)
export default fetchRouter;