import { Hono } from "hono";
import app from "./app.route.js";
import auth from "./auth.route.js";
import main from "./main.route.js";

const api = new Hono();

api.route("/app", app);
api.route("/auth", auth);
api.route("/main", main);

export default api;
