/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
/* eslint-disable import/extensions */
/* eslint-disable no-console */
import chalk from 'chalk';
import joi from 'joi';

import connection from '../db.js';

async function checkIfCustomerExists(customerId) {
  const customerOnDatabase = (await connection.query(`
    SELECT customers.id FROM customers
    WHERE customers.id = ($1)
  `, [customerId])).rows;

  if (customerOnDatabase.length === 0) {
    return false;
  }
  return true;
}

async function checkIfGameIsValid(gameId) {
  const gameOnDatabase = (await connection.query(`
  SELECT games."stockTotal", games."pricePerDay" 
  FROM games
  WHERE games.id = ($1)
`, [gameId])).rows;

  if (gameOnDatabase.length === 0) {
    return { isAvailable: false, reason: 'Game not Registed on Database :(' };
  }

  if (gameOnDatabase[0].stockTotal <= 0) {
    return { isAvailable: false, reason: 'No games on stock :(' };
  }
  return { isAvailable: true, pricePerDay: gameOnDatabase[0].pricePerDay };
}

export async function validadeRentalData(req, res, next) {
  try {
    const rentalData = req.body;
    const { customerId, gameId } = rentalData;

    const rentalDataSchema = joi.object({
      customerId: joi.number().min(1).required(),
      gameId: joi.number().min(1).required(),
      daysRented: joi.number().min(1).required(),
    });

    const { error } = rentalDataSchema.validate(rentalData, { abortEarly: false });

    if (error) {
      console.log(chalk.bold.red(error));
      return res.sendStatus(400);
    }

    const customerExists = await checkIfCustomerExists(customerId);
    if (!customerExists) {
      console.log(chalk.bold.red('Customer not found on Databse :('));
      return res.sendStatus(400);
    }

    const isGameAvailable = await checkIfGameIsValid(gameId);
    const { isAvailable, reason, pricePerDay } = isGameAvailable;
    if (!isAvailable) {
      console.log(chalk.bold.red(reason));
      return res.sendStatus(400);
    }

    res.locals.user = { ...rentalData, pricePerDay };
    next();
  } catch (e) {
    console.log(chalk.bold.red(e));
    return res.sendStatus(500);
  }
}

export async function validadeCloseRentalId(req, res, next) {
  try {
    const rentalId = req.params.id;
    const rentalOnDatabase = (await connection.query(`
      SELECT rentals.*, games."pricePerDay"
      FROM rentals
      JOIN games ON games.id = rentals."gameId"
      WHERE rentals.id = ($1)

    `, [rentalId])).rows;

    if (rentalOnDatabase.length === 0) {
      console.log(chalk.bold.red('Rental not found :('));
      return res.sendStatus(404);
    }

    if (rentalOnDatabase[0].returnDate) {
      console.log(chalk.bold.red('Game already returned!'));
      return res.sendStatus(400);
    }

    res.locals.user = rentalOnDatabase;
    next();
  } catch (e) {
    console.log(chalk.bold.red(e));
    return res.sendStatus(500);
  }
}

export async function validadeDeleteRental(req, res, next) {
  try {
    const rentalId = req.params.id;
    const rentalOnDatabase = (await connection.query(`
      SELECT rentals.id, rentals."returnDate", rentals."gameId"
      FROM rentals
      WHERE rentals.id = ($1)
    `, [rentalId])).rows;

    if (rentalOnDatabase.length === 0) {
      console.log(chalk.bold.red('Rental not found on database :('));
      return res.sendStatus(404);
    }

    if (rentalOnDatabase[0].returnDate !== null) {
      console.log(chalk.bold.red('This rental is already closed'));
      return res.sendStatus(400);
    }

    delete rentalOnDatabase[0].returnDate;
    res.locals.user = rentalOnDatabase;
    next();
  } catch (e) {
    console.log(chalk.bold.red(e));
    return res.sendStatus(500);
  }
}
