/* eslint-disable import/extensions */
import { Router } from 'express';

import {
  getCustomers, getSingleCustomer, postCustomer, updateCustomerInfo,
} from '../Controllers/customersController.js';
import validadeCustomerData from '../Middlewares/postCustomerValidation.js';

const customersRouter = Router();

customersRouter.get('/customers', getCustomers);
customersRouter.get('/customers/:id', getSingleCustomer);
customersRouter.post('/customers', validadeCustomerData, postCustomer);
customersRouter.put('/customers/:id', validadeCustomerData, updateCustomerInfo);

export default customersRouter;
