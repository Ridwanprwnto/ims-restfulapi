import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authMiddleware } from './middleware/authMiddleware.js';
import authRoute from './routes/authRoute.js';
import { logger, logInfo, logError } from './utils/logger.js';
import { config } from 'dotenv';
import { readFile } from 'fs/promises';
import { join } from 'path';

config();

const app = new Hono();
const PORT = process.env.PORT || 4000;

app.use('*', async (c, next) => {
  logger.info(`${c.req.method} ${c.req.url}`);
  c.res.headers.set('X-Powered-By', 'Bun + Hono');
  await next();
});

app.get('/api/info', async (c) => {
  const serverInfo = {
    domainServer: process.env.BASE_URL,
    webServer: process.env.WEB_SERVER,
    portServer: process.env.PORT,
    descServer: process.env.DESC_SERVER,
    pathAPI: process.env.PATH_API,
    apiVersion: process.env.API_VERSION,
    frameworkVersion: require('../package.json').dependencies.hono
  };
  logInfo('API /api/info diakses');
  return c.json(serverInfo);
});

const domainsFromEnv = process.env.CORS_DOMAINS || "";
const whitelist = domainsFromEnv.split(",").map(item => item.trim());

app.use(
  '*',
  cors({
    origin: (origin) => {
      if (!origin) return true;
      if (whitelist.includes(origin)) return true;
      logError(`CORS error: ${origin} is not allowed`);
      return false;
    },
    credentials: true
  })
);

app.use('/api/private/*', authMiddleware);
app.route('/api/auth', authRoute);

app.get('/', async (c) => {
  const html = await readFile(join(import.meta.dir, '../public/index.html'), 'utf-8');
  return c.html(html);
});

serve({ fetch: app.fetch, port: PORT });