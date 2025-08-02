import { Hono } from "hono";
import { helpController } from "../controllers/helpController.js";

const helpRoute = new Hono();

helpRoute.post("/upload-log", helpController);

export default helpRoute;
