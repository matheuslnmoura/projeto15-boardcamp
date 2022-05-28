/* eslint-disable import/extensions */
/* eslint-disable no-console */
import chalk from 'chalk';

import connection from '../db.js';

export async function getCategories(req, res) {
  try {
    const categoriesResponse = (await connection.query('SELECT * FROM categories')).rows;
    res.status(200).send(categoriesResponse);
  } catch (e) {
    console.log(chalk.bold.red(e));
    res.sendStatus(500);
  }
}

export async function postCategories(req, res) {
  const categoryName = res.locals.user;
  console.log(categoryName);
  try {
    await connection.query(`
        INSERT INTO categories (id, name) VALUES (DEFAULT, '${categoryName}')`);
    res.sendStatus(201);
  } catch (e) {
    console.log(chalk.bold.red(e));
    res.sendStatus(500);
  }
}
