import { Hono } from "hono";
import { login, validationController } from "../controllers/authController.js";
import { kondisiController } from "../controllers/kondisiController.js";
import { draftSOController, itemSOController, updateSOController, persentaseSOController, saveSOController } from "../controllers/stockOpnameController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const authRoute = new Hono();

authRoute.post("/login", login);
authRoute.get("/validation", authMiddleware, validationController);

authRoute.get("/kondisi", authMiddleware, kondisiController);

authRoute.post("/draftso", draftSOController);
authRoute.post("/itemso", itemSOController);
authRoute.post("/updateso", updateSOController);
authRoute.post("/persentaseso", persentaseSOController);
authRoute.post("/saveso", saveSOController);

export default authRoute;
