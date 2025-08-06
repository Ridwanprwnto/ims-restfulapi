import { Hono } from "hono";
import usersRoute from "./modules/user.route.js";

const auth = new Hono();

// Delegasikan ke /auth/users/*
auth.route("/users", usersRoute);

export default auth;
