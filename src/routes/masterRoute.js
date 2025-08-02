import { Hono } from "hono";
import { kondisiController } from "../controllers/kondisiController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const masterRoute = new Hono();

masterRoute.get("/kondisi", authMiddleware, kondisiController);

export default masterRoute;
