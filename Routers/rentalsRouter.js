/* eslint-disable import/extensions */
import { Router } from 'express';

import { getRentals } from '../Controllers/rentalsController.js';

const rentalsRouter = Router();

rentalsRouter.get('/rentals', getRentals);

export default rentalsRouter;
