/* eslint-disable import/extensions */
import { Router } from 'express';

import {
  getRentals, postRental, closeRental, deleteRental,
} from '../Controllers/rentalsController.js';
import { validadeRentalData, validadeCloseRentalId, validadeDeleteRental } from '../Middlewares/rentalValidation.js';

const rentalsRouter = Router();

rentalsRouter.get('/rentals', getRentals);
rentalsRouter.post('/rentals', validadeRentalData, postRental);
rentalsRouter.post('/rentals/:id/return', validadeCloseRentalId, closeRental);
rentalsRouter.delete('/rentals/:id', validadeDeleteRental, deleteRental);

export default rentalsRouter;
