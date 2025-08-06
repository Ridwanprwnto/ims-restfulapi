import { Hono } from "hono";
import tokenRoute from "./modules/token.route.js";
import conditionRoute from "./modules/condition.route.js";
import recordRoute from "./modules/record.route.js";
import logsRoute from "./modules/logs.route.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const main = new Hono();

// Middleware global untuk semua /main/*
main.use("*", authMiddleware);

// Delegasikan ke /main/token/*
main.route("/token", tokenRoute);

// Delegasikan ke /main/conditions/*
main.route("/conditions", conditionRoute);

// Delegasikan ke /main/master/*
main.route("/records", recordRoute);

// Delegasikan ke /main/logs/*
main.route("/logs", logsRoute);

export default main;
