/* eslint-disable import/extensions */
/* eslint-disable no-console */
import chalk from 'chalk';
import joi from 'joi';
import DateExtension from '@joi/date';

import connection from '../db.js';

const Joi = joi.extend(DateExtension);

function formatCustomerName(customerData) {
  // eslint-disable-next-line no-param-reassign
  customerData.name = customerData.name.toLowerCase();
  const customerNameArr = customerData.name.split(' ');
  const newCustomerNameArr = [];
  customerNameArr.forEach((substr) => {
    newCustomerNameArr.push(substr.charAt(0).toUpperCase() + substr.slice(1));
  });
  const newCustomerName = newCustomerNameArr.join(' ');
  return newCustomerName;
}

async function validadeCpfOnDatabase(customerData, customerId) {
  const { cpf } = customerData;
  const databaseCustomer = (await connection.query(`
    SELECT * FROM customers 
    WHERE customers.cpf = '${cpf}'
  `)).rows;

  // eslint-disable-next-line radix
  if (databaseCustomer.length !== 0 && parseInt(customerId) !== databaseCustomer[0].id) {
    return false;
  }
  return true;
}

async function checkForCustomerOnDatabase(customerId) {
  let customerExists = false;
  const customerOnDatabase = (await connection.query(`
    SELECT * FROM customers
    WHERE customers.id = ${customerId}
  `)).rows;

  if (customerOnDatabase.length !== 0) {
    customerExists = true;
  }

  return customerExists;
}

// eslint-disable-next-line consistent-return
export default async function validadeCustomerData(req, res, next) {
  const customerData = req.body;

  const customerId = req.params.id;
  if (customerId) {
    const customerExists = await checkForCustomerOnDatabase(customerId);

    if (!customerExists) {
      console.log(chalk.bold.red('Customer not found! :('));
      return res.sendStatus(404);
    }
  }

  const customerDataSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().pattern(/^[0-9]{10,11}$/).allow(null, '').required(),
    cpf: joi.string().pattern(/^[0-9]{11,11}$/).required(),
    birthday: Joi.date().format('YYYY-MM-DD').required(),
  });

  const { error } = customerDataSchema.validate(customerData, { abortEarly: false });

  if (error) {
    console.log(chalk.bold.red(error));
    return res.sendStatus(400);
  }

  const isValidCpf = await validadeCpfOnDatabase(customerData, customerId);

  if (!isValidCpf) {
    console.log(chalk.bold.red('This CPF has already been registred!'));
    return res.sendStatus(409);
  }

  customerData.name = formatCustomerName(customerData);

  res.locals.user = { id: customerId, ...customerData };
  next();
}
