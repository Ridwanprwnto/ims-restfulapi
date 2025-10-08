import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { logError } from "../utils/logger.js";

dotenv.config();

export const authMiddleware = async (c, next) => {
    // Request via Kong, trust headers
    const consumer = c.req.header("X-Consumer-Username");
    if (consumer) {
        c.set("user", { username: consumer });
        return await next();
    }

    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        logError(`Token validation error: Unauthorized`);
        return c.json({ error: "Unauthorized" }, 401);
    }

    const token = authHeader.split(" ")[1];

    try {
        // Kalau refresh route, gunakan decode agar bisa cek meski expired
        if (c.req.path === process.env.PATH_API+"/main/token/refresh") {
            const decoded = jwt.decode(token);
            if (!decoded) {
                return c.json({ error: "Invalid token" }, 401);
            }
            c.set("user", decoded);
            return await next();
        }

        // Normal route → full verify (reject kalau expired/invalid)
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ["HS256"],
        });
        c.set("user", decoded);
        await next();
    } catch {
        return c.json({ error: "Invalid token" }, 401);
    }
};


