import { Hono } from "hono";
import { loginUser } from "../../../controllers/app/loginController.js";

const users = new Hono();

// POST /auth/users/login
users.post("/login", loginUser);

export default users;
