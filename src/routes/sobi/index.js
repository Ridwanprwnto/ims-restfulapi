import { Hono } from "hono";
import auth from "./auth.route.js";
import main from "./main.route.js";

const api = new Hono();

api.route("/auth", auth);
api.route("/main", main);

export default api;
