import { Hono } from "hono";
import { draftSOController, itemSOController, updateSOController, persentaseSOController, saveSOController } from "../controllers/stockOpnameController.js";

const opnameRoute = new Hono();

opnameRoute.post("/draftso", draftSOController);
opnameRoute.post("/itemso", itemSOController);
opnameRoute.post("/updateso", updateSOController);
opnameRoute.post("/persentaseso", persentaseSOController);
opnameRoute.post("/saveso", saveSOController);

export default opnameRoute;
