/* eslint-disable import/extensions */
import { Router } from 'express';

import getCategories from '../Controllers/categoriesController.js';

const categoriesRouter = Router();

categoriesRouter.get('/categories', getCategories);

export default categoriesRouter;
