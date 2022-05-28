/* eslint-disable import/extensions */
/* eslint-disable no-console */
import express, { json } from 'express';
import cors from 'cors';
import chalk from 'chalk';
import dotenv from 'dotenv';

import categoriesRouter from './Routers/categoriesRouter.js';

const app = express();
app.use(cors());
app.use(json());
dotenv.config();

app.use(categoriesRouter);

app.listen(process.env.PORT, () => {
  console.log(chalk.bold.blue('Server running on port ', process.env.PORT));
});
