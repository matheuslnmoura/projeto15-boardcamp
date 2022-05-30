/* eslint-disable import/extensions */
import { Router } from 'express';

import { getRentals, postRental } from '../Controllers/rentalsController.js';
import validadeRentalData from '../Middlewares/rentalValidation.js';

const rentalsRouter = Router();

rentalsRouter.get('/rentals', getRentals);
rentalsRouter.post('/rentals', validadeRentalData, postRental);

export default rentalsRouter;
