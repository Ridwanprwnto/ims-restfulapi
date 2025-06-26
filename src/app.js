import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authMiddleware } from './middleware/authMiddleware.js';
import authRoute from './routes/authRoute.js';
import { logger, logInfo, logError } from './utils/logger.js';
import dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import { join } from 'path';

dotenv.config();

const app = new Hono();
const PORT = Bun.env.PORT || 4000;

app.use('*', async (c, next) => {
  logger.info(`${c.req.method} ${c.req.url}`);
  c.res.headers.set('X-Powered-By', 'Bun + Hono');
  await next();
});

app.get('/api/info', async (c) => {
  const serverInfo = {
    domainServer: Bun.env.BASE_URL,
    webServer: Bun.env.WEB_SERVER,
    portServer: Bun.env.PORT,
    descServer: Bun.env.DESC_SERVER,
    pathAPI: Bun.env.PATH_API,
    apiVersion: Bun.env.API_VERSION,
    frameworkVersion: require('../package.json').dependencies.hono
  };
  logInfo('API /api/info diakses');
  return c.json(serverInfo);
});

const domainsFromEnv = Bun.env.CORS_DOMAINS || "";
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