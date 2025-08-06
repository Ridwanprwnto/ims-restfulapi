import { Hono } from "hono";
import { tokenController } from "../../../controllers/app/tokenController.js";

const token = new Hono();

// POST /main/token/refresh
token.get("/refresh", tokenController);

export default token;
