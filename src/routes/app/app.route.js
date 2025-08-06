import { Hono } from "hono";
import infoRoute from "./modules/info.route.js";

const app = new Hono();

// Delegasikan ke /app/info/*
app.route("/info", infoRoute);

export default app;
