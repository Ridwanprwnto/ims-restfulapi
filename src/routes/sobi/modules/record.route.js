import { Hono } from "hono";
import { draftSOController, itemSOController, processSOController, persentaseSOController, saveSOController } from "../../../controllers/sobi/recordsController.js";

const records = new Hono();

records.post("/drafts", draftSOController);
records.post("/items", itemSOController);
records.post("/progress", persentaseSOController);
records.post("/process", processSOController);
records.put("/process/:norefId", saveSOController);

export default records;
