import { Hono } from "hono";
import { login, validationController } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const authRoute = new Hono();

authRoute.post("/login", login);
authRoute.get("/validation", authMiddleware, validationController);

export default authRoute;
