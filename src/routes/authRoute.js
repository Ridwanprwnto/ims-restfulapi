import { Hono } from 'hono';
import { login, validationController } from '../controllers/authController.js';
import { draftSOController, itemSOController } from '../controllers/stockOpnameController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const authRoute = new Hono();

authRoute.post('/login', login);
authRoute.get('/validation', authMiddleware, validationController);

authRoute.post('/draftso', draftSOController)
authRoute.post('/itemso', itemSOController)

export default authRoute;