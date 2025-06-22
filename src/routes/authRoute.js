import { Hono } from 'hono';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { login } from '../controllers/authController.js';

const authRoute = new Hono();

authRoute.post('/login', login);

// Endpoint hanya bisa diakses jika lewat authMiddleware
authRoute.get('/private/data', authMiddleware, (c) => {
return c.json({ secret: 'Ini data rahasia hanya untuk user yang valid' });
});

export default authRoute;