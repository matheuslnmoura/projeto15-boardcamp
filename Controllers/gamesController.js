/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */
/* eslint-disable no-console */
import chalk from 'chalk';

import connection from '../db.js';

async function getQueryGames(req, res) {
  const queryObj = req.query;
  try {
    const getGameQueryResponse = (await connection.query(
      `
        SELECT games.*, categories.name as "categoryName"
        FROM games
        JOIN categories
        ON games."categoryId" = categories.id
        WHERE LOWER(games.name) LIKE LOWER('${queryObj.name}%')
      `,
    ));

    res.status(200).send(getGameQueryResponse.rows);
  } catch (e) {
    console.log(chalk.bold.red(e));
    res.sendStatus(500);
  }
}

export async function getGames(req, res) {
  try {
    const queryObj = await req.query;
    if (queryObj.name) {
      return getQueryGames(req, res);
    }
    const getGamesResponse = (await connection.query(
      `
        SELECT games.*, categories.name as "categoryName"
        FROM games
        JOIN categories
        ON games."categoryId" = categories.id

        `,
    )).rows;
    return res.status(200).send(getGamesResponse);
  } catch (e) {
    console.log(chalk.bold.red(e));
    return res.sendStatus(500);
  }
}

export async function postGames(req, res) {
  try {
    const game = res.locals.user;
    console.log(game);
    console.log(game.image);
    await connection.query(`
      INSERT INTO games 
      (id, name, image, "stockTotal", "categoryId", "pricePerDay") 
      VALUES (DEFAULT, '${game.name}', '${game.image}', ${game.stockTotal}, ${game.categoryId}, ${game.pricePerDay})
    `);
    return res.sendStatus(201);
  } catch (e) {
    console.log(chalk.bold.red(e));
    return res.sendStatus(500);
  }
}
