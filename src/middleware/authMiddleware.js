import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { logInfo, logError } from '../utils/logger.js';

config();

export const authMiddleware = async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logError(`Token validation error: Unauthorized`);
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verifikasi dan dekode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Simpan informasi pengguna di context
    c.set('user', decoded);

    await next();
  } catch (error) {
    logError(`Token validation error: Invalid token`);
    return c.json({ error: "Invalid token" }, 401);
  }
};
