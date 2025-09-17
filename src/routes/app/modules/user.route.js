import { Hono } from "hono";
import { loginUser } from "../../../controllers/app/loginController.js";
import { logoutUser } from "../../../controllers/app/logoutController.js";

const users = new Hono();

// POST /auth/users/login
users.post("/login", loginUser);

// POST /auth/users/logout
users.post("/logout", logoutUser);

export default users;
