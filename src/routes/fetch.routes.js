import {Router} from 'express';
import { fetchDataFromApi } from '../controllers/fetchDataFromApi.js';

const fetchRouter = Router();
fetchRouter.route('/fetch').get(fetchDataFromApi);
export default fetchRouter;