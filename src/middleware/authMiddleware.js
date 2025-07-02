import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { logError } from "../utils/logger.js";

dotenv.config();

export const authMiddleware = async (c, next) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        logError(`Token validation error: Unauthorized`);
        return c.json({ error: "Unauthorized" }, 401);
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, Bun.env.JWT_SECRET);

        c.set("user", decoded);

        await next();
    } catch (error) {
        logError(`Token validation error: Invalid token`);
        return c.json({ error: "Invalid token" }, 401);
    }
};
