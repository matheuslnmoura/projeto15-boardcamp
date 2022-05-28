/* eslint-disable import/extensions */
import { Router } from 'express';

import {
  getCategories,
  postCategories,
} from '../Controllers/categoriesController.js';
import validadeCategoryName from '../Middlewares/categoryNameValidation.js';

const categoriesRouter = Router();

categoriesRouter.get('/categories', getCategories);
categoriesRouter.post('/categories', validadeCategoryName, postCategories);

export default categoriesRouter;
