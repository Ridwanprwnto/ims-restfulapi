import { Hono } from "hono";
import main from "./main.route.js";

const api = new Hono();

api.route("/main", main);

export default api;
