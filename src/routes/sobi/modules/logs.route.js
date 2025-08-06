import { Hono } from "hono";
import { logController } from "../../../controllers/sobi/logsController";

const logs = new Hono();

logs.post("/*", logController);

export default logs;
