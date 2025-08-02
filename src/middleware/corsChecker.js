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

    return next();
};

export default corsChecker;
