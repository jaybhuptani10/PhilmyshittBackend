import {Router} from 'express';
import { fetchDataFromApi, getMovieDetails, getInfo, getSearchedMovie, getSeriesInfo } from '../controllers/fetchDataFromApi.js';

const fetchRouter = Router();
fetchRouter.route('/fetch').get(fetchDataFromApi);
fetchRouter.route('/details').get(getInfo);
fetchRouter.route('/seriesdetails').get(getSeriesInfo);
fetchRouter.route('/details').get(getMovieDetails);

fetchRouter.route('/search').get(getSearchedMovie)
export default fetchRouter;