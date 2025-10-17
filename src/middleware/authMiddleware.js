import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { logError, logInfo } from "../utils/logger.js";

dotenv.config();

export const authMiddleware = async (c, next) => {
    try {
        const consumer = c.req.header("X-Consumer-Username");
        const authHeader = c.req.header("Authorization");

        // Request melalui Kong Gateway
        if (consumer) {
            logInfo(`Request dari Kong consumer: ${consumer}`);

            // Cek apakah Kong meneruskan token user (misal dari plugin jwt/headers)
            if (authHeader && authHeader.startsWith("Bearer ")) {
                const token = authHeader.split(" ")[1];

                try {
                    // Jika refresh route → decode agar tetap bisa lanjut meski expired
                    if (c.req.path === process.env.PATH_API + "/main/token/refresh") {
                        const decoded = jwt.decode(token);
                        if (!decoded) {
                            logError("Gagal decode token dari Kong");
                            return c.json({ error: "Invalid token" }, 401);
                        }
                        c.set("user", decoded);
                        return await next();
                    }

                    // Verifikasi token user biasa
                    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
                        algorithms: ["HS256"],
                    });
                    c.set("user", decoded);
                    return await next();
                } catch (err) {
                    logError(`Token validation error (via Kong): ${err.message}`);
                    return c.json({ error: "Invalid token" }, 401);
                }
            } else {
                // Jika Kong tidak meneruskan token user (misalnya hanya consumer)
                c.set("user", { username: consumer });
                return await next();
            }
        }

        // Request langsung dari frontend (bukan via Kong)
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            logError("Token validation error: Unauthorized");
            return c.json({ error: "Unauthorized" }, 401);
        }

        const token = authHeader.split(" ")[1];

        // Jika refresh route → decode agar tetap bisa lanjut
        if (c.req.path === process.env.PATH_API + "/main/token/refresh") {
            const decoded = jwt.decode(token);
            if (!decoded) {
                return c.json({ error: "Invalid token" }, 401);
            }
            c.set("user", decoded);
            return await next();
        }

        // Normal verify untuk route biasa
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ["HS256"],
        });
        c.set("user", decoded);
        await next();
    } catch (err) {
        logError(`Middleware error: ${err.message}`);
        return c.json({ error: "Internal Server Error" }, 500);
    }
};
