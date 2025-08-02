import { Hono } from "hono";
import authRoute from "../routes/authRoute.js";
import opnameRoute from "../routes/opnameRoute.js";
import masterRoute from "../routes/masterRoute.js";
import helpRoute from "../routes/helpRoute.js";
import dotenv from "dotenv";

dotenv.config();

const services = new Hono();

// Route REST
services.route("/auth", authRoute);
services.route("/master", masterRoute);
services.route("/opname", opnameRoute);
services.route("/help", helpRoute);

export default services;
