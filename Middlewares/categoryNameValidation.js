/* eslint-disable import/extensions */
/* eslint-disable no-console */
import joi from 'joi';
import chalk from 'chalk';

import connection from '../db.js';

// eslint-disable-next-line consistent-return
export default async function validadeCategoryName(req, res, next) {
  const name = req.body;

  const nameSchema = joi.object({
    name: joi.string().required(),
  });

  const { error } = nameSchema.validate(name, { abortEarly: false });

  if (error) {
    console.log(chalk.bold.red('You must type a name'));
    return res.sendStatus(400);
  }

  const lowerCaseName = name.name.toLowerCase();
  const checkDatabaseName = await connection.query(`SELECT * FROM categories WHERE name = '${lowerCaseName}'`);

  console.log(checkDatabaseName.rows);

  if (checkDatabaseName.rowCount !== 0) {
    console.log(chalk.bold.red('Category Already Registred'));
    return res.sendStatus(409);
  }

  res.locals.user = lowerCaseName;
  next();
}
