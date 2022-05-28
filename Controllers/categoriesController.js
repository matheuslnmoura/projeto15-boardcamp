/* eslint-disable import/extensions */
/* eslint-disable no-console */
import chalk from 'chalk';
import connection from '../db.js';

export default async function getCategories(req, res) {
  try {
    const categoriesResponse = await connection.query('SELECT * FROM categories').rows;
    res.status(200).send(categoriesResponse);
  } catch (e) {
    console.log(chalk.bold.red(e));
    res.sendStatus(500);
  }
}
