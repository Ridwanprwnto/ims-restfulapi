import { Hono } from "hono";
import handleServerInfo from "../../../handlers/app/serverInfo.js";

const info = new Hono();

info.get("/*", handleServerInfo);

export default info;
