import { Hono } from "hono";
import { conditionController } from "../../../controllers/app/conditionController.js";

const token = new Hono();

// POST /main/token/refresh
token.get("/*", conditionController);

export default token;
