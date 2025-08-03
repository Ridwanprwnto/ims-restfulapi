import { Hono } from "hono";
import infoRoute from "../routes/infoRoute.js";

const restServices = new Hono();

restServices.route("/info", infoRoute);

export default restServices;
