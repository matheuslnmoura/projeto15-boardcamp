/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */
/* eslint-disable no-console */
import chalk from 'chalk';

import connection from '../db.js';

export async function getCustomers(req, res) {
  const queryParams = req.query;
  try {
    if (queryParams.cpf) {
      try {
        const cpfCustomerQueryResponse = (await connection.query(`
          SELECT * FROM customers
          WHERE customers.cpf LIKE ('${queryParams.cpf}%')
        `)).rows;

        if (cpfCustomerQueryResponse.length === 0) {
          return res.status(200).send('No Customers Found :(');
        }

        return res.status(200).send(cpfCustomerQueryResponse);
      } catch (e) {
        console.log(chalk.bold.red(e));
        return res.sendStatus(500);
      }
    }

    const customersResponse = (await connection.query('SELECT * FROM customers')).rows;
    return res.status(200).send(customersResponse);
  } catch (e) {
    console.log(chalk.bold.red(e));
    return res.sendStatus(500);
  }
}

export async function getSingleCustomer(req, res) {
  try {
    const customerInfo = req.params;
    const databaseCustomer = (await connection.query(`
      SELECT * FROM customers
      WHERE customers.id = ${customerInfo.id}
    `)).rows;

    if (databaseCustomer.length === 0) {
      return res.status(404).send('Customer Not Found :(');
    }

    return res.status(200).send(databaseCustomer[0]);
  } catch (e) {
    console.log(chalk.bold.red(e));
    return res.sendStatus(500);
  }
}

export async function postCustomer(req, res) {
  try {
    const customerData = res.locals.user;
    const {
      name, phone, cpf, birthday,
    } = customerData;
    await connection.query(`
    INSERT INTO customers 
    (id, name, phone, cpf, birthday) 
    VALUES (DEFAULT, $1, $2, $3, $4)
  `, [name, phone, cpf, birthday]);
    return res.sendStatus(201);
  } catch (e) {
    console.log(chalk.bold.red(e));
    return res.sendStatus(500);
  }
}

export async function updateCustomerInfo(req, res) {
  try {
    const customerData = res.locals.user;
    const {
      id, name, phone, cpf, birthday,
    } = customerData;
    await connection.query(`
      UPDATE customers
      SET (name, phone, cpf, birthday) = ( $1, $2, $3, $4)
      WHERE customers.id = ${id}
    `, [name, phone, cpf, birthday]);
    return res.status(201).send(customerData);
  } catch (e) {
    console.log(chalk.bold.red(e));
    return res.sendStatus(500);
  }
}
