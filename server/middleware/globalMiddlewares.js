import morgan from 'morgan';
import express from 'express';
import cors from 'cors';

export default function setupGlobalMiddlewares(app) {
  const morganFormat = '[:date[iso]] - :method :url :status :res[content-length] - :response-time ms';
  app.use(morgan(morganFormat));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());
}
