import { logInfo, logError } from "../utils/logger.js";
import { writeFile } from "node:fs/promises";
import path from "node:path";

export const helpController = async (c) => {
    const { message, log } = await c.req.json();
    try {
        if (!message || !log) {
            logError("Gagal: No message and log data request");
            return c.json({ success: false, message: `Gagal: Message and log are required` }, 404);
        }

        logInfo(`Success receive log data client`);
        return c.json(
            {
                success: true,
                message: "Success receive log data client",
            },
            200
        );
    } catch (err) {
        logError(`Gagal: `, err);
        return c.json({ success: false, message: `Failed to fetch log client`, error: err.message }, 500);
    }
};
