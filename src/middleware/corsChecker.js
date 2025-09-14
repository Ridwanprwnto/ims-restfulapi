import { logError } from "../utils/logger.js";

const corsChecker = async (c, next) => {
    const origin = c.req.header("Origin");
    const isMobileApp = c.req.header("X-Mobile-Client") === "true";
    const isDev = Bun.env.NODE_ENV === "development";

    const whitelist = (Bun.env.CORS_DOMAINS || "")
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean);

    const allowOrigin = isDev || !origin || whitelist.includes(origin) || isMobileApp;

    if (!allowOrigin) {
        logError(`CORS error: ${origin} is not allowed`);
        return c.text("CORS Not Allowed", 403);
    }

    // Set CORS headers
    c.res.headers.set("Access-Control-Allow-Origin", origin || "*");
    c.res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    c.res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Mobile-Client");
    c.res.headers.set("Access-Control-Allow-Credentials", "true");

    // Handle preflight OPTIONS request
    if (c.req.method === "OPTIONS") {
        return c.body(null, 204);
    }

    return next();
};

export default corsChecker;
