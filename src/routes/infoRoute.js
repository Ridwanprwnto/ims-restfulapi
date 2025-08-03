import { Hono } from "hono";
import handleServerInfo from "../handlers/serverInfo.js";

const infoRoute = new Hono();

infoRoute.get("/*", handleServerInfo);

export default infoRoute;
