/* eslint-disable import/extensions */
/* eslint-disable no-console */
import joi from 'joi';
import chalk from 'chalk';

import connection from '../db.js';

// eslint-disable-next-line consistent-return
async function checkIfCategoryExists(req) {
  const game = req.body;
  const categoriesIdsArr = [];
  const categoriesDatabaseresponse = (await connection.query('SELECT * FROM categories'));
  const categoriesDatabase = categoriesDatabaseresponse.rows;

  categoriesDatabase.forEach((item) => {
    categoriesIdsArr.push(item.id);
  });

  let categoryError = true;

  if (categoriesIdsArr.includes(game.categoryId)) {
    categoryError = false;
  }

  return categoryError;
}

async function checkName(req) {
  const game = req.body;
  const gamesDatabaseResponse = await connection.query('SELECT * FROM games');
  const gamesDatabase = gamesDatabaseResponse.rows;

  let nameError = false;

  gamesDatabase.forEach((databaseGame) => {
    if (databaseGame.name.toLowerCase() === game.name.toLowerCase()) {
      nameError = true;
    }
  });

  return nameError;
}

// eslint-disable-next-line consistent-return
export default async function validadeGameInfo(req, res, next) {
  const game = req.body;

  const gameSchema = joi.object({
    name: joi.string().required(),
    image: joi.string().allow(null, ''),
    stockTotal: joi.number().integer().min(1).required(),
    categoryId: joi.number().integer().required(),
    pricePerDay: joi.number().min(1).required(),
  });

  const { error } = gameSchema.validate(game, { abortEarly: false });

  if (error) {
    console.log(chalk.bold.red(error));
    return res.sendStatus(400);
  }

  const categoryError = await checkIfCategoryExists(req);
  if (categoryError) {
    console.log(chalk.bold.red('Category does not exist'));
    return res.sendStatus(400);
  }

  const nameError = await checkName(req);
  if (nameError) {
    console.log(chalk.bold.red('This game has already been registred'));
    return res.sendStatus(409);
  }

  game.name = game.name.toLowerCase();
  const gameNameArr = game.name.split(' ');
  const newGameNameArr = [];
  gameNameArr.forEach((substr) => {
    newGameNameArr.push(substr.charAt(0).toUpperCase() + substr.slice(1));
  });
  const newGameName = newGameNameArr.join(' ');
  game.name = newGameName;

  res.locals.user = game;
  next();
}
