import express from 'express';
const app = express();

import mongoose from 'mongoose';
import logger from './utils/logger.js';
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
import setupGlobalMiddlewares from './middleware/globalMiddlewares.js';
setupGlobalMiddlewares(app);

// Setup API routes
app.use('/api', api);

// eslint-disable-next-line  no-unused-vars
app.use(function (error, req, res, next) {
  // if error thrown from jwt validation check
  if (error.name === 'UnauthorizedError') {
    res.status(401).send('Invalid token');
    return;
  }

  logger.error(`Error: ${error}`);
  res.status(500).json({
    data: null,
    error: error.message
  });
});

export default app;
