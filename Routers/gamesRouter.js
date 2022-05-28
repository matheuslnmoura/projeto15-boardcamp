/* eslint-disable import/extensions */
import { Router } from 'express';

import { getGames, postGames } from '../Controllers/gamesController.js';
import validadeGameInfo from '../Middlewares/postGameValidation.js';

const gamesRouter = Router();

gamesRouter.get('/games', getGames);
gamesRouter.post('/games', validadeGameInfo, postGames);

export default gamesRouter;
