/* eslint-disable import/extensions */
import { Router } from 'express';

import { getGames } from '../Controllers/gamesController.js';
// import validadeCategoryName from '../Middlewares/categoryNameValidation.js';

const gamesRouter = Router();

gamesRouter.get('/games', getGames);
// gamesRouter.post('/games', postGames);

export default gamesRouter;
