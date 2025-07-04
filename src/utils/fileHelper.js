// utils/fileHelper.js
import { existsSync, unlink } from "fs";
import { promisify } from "util";
import { logInfo, logError } from "../utils/logger";

const unlinkAsync = promisify(unlink);

export const deleteFile = async (filePath) => {
    try {
        if (existsSync(filePath)) {
            await unlinkAsync(filePath);
            logInfo(`File deleted successfully: ${filePath}`);
        }
    } catch (err) {
        logError(`Error deleting file ${filePath}:`, err);
        throw err;
    }
};
