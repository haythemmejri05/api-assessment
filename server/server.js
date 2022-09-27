import express from 'express';
const app = express();

import mongoose from 'mongoose';
//import logger from './utils/logger.js';
import config from './config/config.js';
import api from './api/v1/api.js';
import populateDatabase from './utils/populateDatabase.js';

// Connect Mongoose to the database
mongoose.connect(config.db.url);

// populate database with dummy entries
if (config.populateDatabase) {
  populateDatabase();
}

// Setup the global middlewares
import addGlobalMiddlewares from './middleware/globalMiddlewares.js';
addGlobalMiddlewares(app);

// Setup API routes
app.use('/api', api);

// eslint-disable-next-line  no-unused-vars
app.use(function (err, req, res, next) {
  // if error thrown from jwt validation check
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Invalid token');
    return;
  }

  console.error('Error');
  res.status(500).send('Error');
});

export default app;
