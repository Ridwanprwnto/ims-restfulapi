import { Hono } from 'hono';
import { login, validationController } from '../controllers/authController.js';
import { draftSOController } from '../controllers/draftSOController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const authRoute = new Hono();

authRoute.post('/login', login);
authRoute.get('/validation', authMiddleware, validationController);

authRoute.post('/draftso', draftSOController)

export default authRoute;