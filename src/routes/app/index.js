import { Hono } from "hono";
import app from "./app.route.js";

const api = new Hono();

api.route("/app", app);

export default api;
