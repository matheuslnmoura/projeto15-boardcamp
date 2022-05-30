/* eslint-disable import/extensions */
import { Router } from 'express';

import { getRentals, postRental, closeRental } from '../Controllers/rentalsController.js';
import { validadeRentalData, validadeCloseRentalId } from '../Middlewares/rentalValidation.js';

const rentalsRouter = Router();

rentalsRouter.get('/rentals', getRentals);
rentalsRouter.post('/rentals', validadeRentalData, postRental);
rentalsRouter.post('/rentals/:id/return', validadeCloseRentalId, closeRental);

export default rentalsRouter;
