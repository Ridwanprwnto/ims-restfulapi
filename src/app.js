import { Hono } from "hono";
import { readFile } from "fs/promises";
import { join } from "path";
import dotenv from "dotenv";
import { logger } from "./utils/logger.js";
import corsChecker from "./middleware/corsChecker.js";
import appRoutes from "./routes/app/index.js";
import sobiRoutes from "./routes/sobi/index.js";

dotenv.config();

const app = new Hono();

// Middleware for logging and setting headers
app.use("*", async (c, next) => {
    logger.info(`${c.req.method} ${c.req.url}`);
    c.res.headers.set("X-Powered-By", "Bun + Hono");
    await next();
});

// CORS
app.use("*", corsChecker);

// Layanan Utama
app.route(Bun.env.PATH_API, appRoutes);

// Layanan Sobi
app.route(Bun.env.PATH_API_SOBI, sobiRoutes);

// Static Files
app.get("/", async (c) => {
    const html = await readFile(join(import.meta.dir, "../public/index.html"), "utf-8");
    return c.html(html);
});

// Not Found handler
app.notFound((c) => {
    return c.json({ message: "Endpoint tidak ditemukan" }, 404);
});

export default app;
