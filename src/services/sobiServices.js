import { Hono } from "hono";
import authRoute from "../routes/authRoute.js";
import opnameRoute from "../routes/opnameRoute.js";
import masterRoute from "../routes/masterRoute.js";
import helpRoute from "../routes/helpRoute.js";

const sobiServices = new Hono();

// Route REST
sobiServices.route("/auth", authRoute);
sobiServices.route("/master", masterRoute);
sobiServices.route("/opname", opnameRoute);
sobiServices.route("/help", helpRoute);

export default sobiServices;
