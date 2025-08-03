import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { readFile } from "fs/promises";
import { join } from "path";
import dotenv from "dotenv";

import { logger } from "./utils/logger.js";
import corsChecker from "./middleware/corsChecker.js";
import restServices from "./services/index.js";
import sobiServices from "./services/sobiServices.js";

dotenv.config();

const app = new Hono();
const PORT = Bun.env.PORT || 4000;

// Logging
app.use("*", async (c, next) => {
    logger.info(`${c.req.method} ${c.req.url}`);
    c.res.headers.set("X-Powered-By", "Bun + Hono");
    await next();
});

// CORS
app.use("*", corsChecker);

// Layanan Utama
app.route(Bun.env.PATH_API, restServices);

// Layanan sobi
app.route(Bun.env.PATH_API_SOBI, sobiServices);

// Static index.html
app.get("/", async (c) => {
    const html = await readFile(join(import.meta.dir, "../public/index.html"), "utf-8");
    return c.html(html);
});

// Start
serve({ fetch: app.fetch, port: PORT });
