import { logInfo, logError } from "../utils/logger.js";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import fs from "node:fs";

export const helpController = async (c) => {
    try {
        const formData = await c.req.formData();

        const file = formData.get("file");
        const platform = formData.get("platform");
        const timestamp = formData.get("timestamp");
        const message = formData.get("message");

        if (!file || !file.name || !file.stream) {
            logError("Gagal: No file uploaded");
            return c.json({ success: false, message: "No file uploaded" }, 400);
        }

        const logsDir = path.resolve("files/logs");
        const filePath = path.join(logsDir, file.name);

        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }

        const buffer = await file.arrayBuffer();
        await writeFile(filePath, Buffer.from(buffer));

        logInfo(`Log file saved to: ${filePath}`);
        return c.json({ success: true, message: "Log file uploaded successfully" }, 200);
    } catch (err) {
        logError("Gagal upload log:", err);
        return c.json({ success: false, message: "Server error", error: err.message }, 500);
    }
};
