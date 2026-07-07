import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/error.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || '*' }));
  app.use(express.json());
  if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

  app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date() }));
  app.use('/api', routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
