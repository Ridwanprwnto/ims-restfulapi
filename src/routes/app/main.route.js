import { Hono } from "hono";
import tokenRoute from "./modules/token.route.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const main = new Hono();

// Middleware global untuk semua /main/*
main.use("*", authMiddleware);

// Delegasikan ke /main/token/*
main.route("/token", tokenRoute);

export default main;
