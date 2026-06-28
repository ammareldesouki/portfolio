import express from 'express';
import cors from 'cors';
import path from 'path';
import { env } from './config/env';
import { connectDatabase } from './config/database';
import routes from './routes/index';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();

app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'API is running', timestamp: new Date().toISOString() });
});

app.use('/api', routes);

app.use(errorMiddleware);

async function start() {
  await connectDatabase();
  app.listen(env.port, () => {
    console.log(`[Server] Running on port ${env.port} in ${env.nodeEnv} mode`);
  });
}

start().catch(console.error);

export default app;
