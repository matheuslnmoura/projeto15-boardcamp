/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */
/* eslint-disable no-console */
import chalk from 'chalk';

import connection from '../db.js';

async function buildWhereQuery(req) {
  const queryArr = (Object.entries(req.query));
  let whereQuery = '';

  queryArr.forEach((query, index) => {
    if (index === 0) {
      whereQuery = `WHERE "${query[0]}" = ${query[1]}`;
    }
    if (index > 0) {
      whereQuery += ` AND "${query[0]}" = ${query[1]}`;
    }
  });

  return whereQuery;
}

function calculateDays(rentDate, returnDate) {
  const day1 = new Date(rentDate);
  const day2 = new Date(returnDate);

  const difference = day2.getTime() - day1.getTime();

  const daysRented = difference / (1000 * 3600 * 24);

  if (returnDate) {
    return daysRented;
  }
  return null;
}

export async function getRentals(req, res) {
  try {
    const whereQuery = await buildWhereQuery(req);
    const rentalsListResponse = (await connection.query(`
      SELECT 
        rentals.*, 
        customers.name AS "customerName", 
        games.name AS "gameName", 
        games."pricePerDay" AS "pricePerDay", 
        categories.id AS "categoryId", 
        categories.name AS "categoryName"
      FROM rentals 
      JOIN customers ON customers.id = rentals."customerId" 
      JOIN games ON games.id = rentals."gameId" 
      JOIN categories ON games."categoryId" = categories.id 
      ${whereQuery}
    `)).rows;

    const rental = [];
    rentalsListResponse.forEach((item) => {
      const actualDaysRented = calculateDays(item.rentDate, item.returnDate);

      const rentalItem = {
        ...item,
        customer: {
          id: item.customerId,
          name: item.customerName,
        },
        game: {
          id: item.gameId,
          name: item.gameName,
          categoryId: item.categoryId,
          categoryName: item.categoryName,
        },
      };

      rentalItem.originalPrice = rentalItem.daysRented * rentalItem.pricePerDay;
      if (actualDaysRented > rentalItem.daysRented) {
        rentalItem.delayFee = (actualDaysRented - rentalItem.daysRented) * rentalItem.pricePerDay;
      }

      delete rentalItem.pricePerDay;
      delete rentalItem.customerName;
      delete rentalItem.gameName;
      delete rentalItem.categoryId;
      delete rentalItem.categoryName;

      rental.push(rentalItem);
    });

    return res.status(200).send(rental);
  } catch (e) {
    console.log(chalk.bold.red(e));
    return res.sendStatus(500);
  }
}

export async function postRental(req, res) {
  const rentalData = res.locals.user;
  const {
    customerId, gameId, daysRented, pricePerDay,
  } = rentalData;
  const todayDate = new Date();
  // todayDate = todayDate.toString();
  console.log(todayDate);
  await connection.query(`
    INSERT INTO rentals
    (
      id,
      "customerId",
      "gameId",
      "rentDate",
      "daysRented",
      "returnDate",
      "originalPrice",
      "delayFee"
    )
    VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7)
  `, [customerId, gameId, todayDate, daysRented, null, daysRented * pricePerDay, null]);
  res.sendStatus(201);
}
