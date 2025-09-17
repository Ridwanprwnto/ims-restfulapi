import { logError } from "../../utils/logger.js";

// const tokenBlacklist = new Set();

export const logoutUser = async (c) => {
    try {
        const authHeader = c.req.header("Authorization");
        if (!authHeader) {
            return c.json({ success: false, message: "No token provided" }, 401);
        }

        // const token = authHeader.replace("Bearer ", "").trim();
        // tokenBlacklist.add(token);

        return c.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        logError(`Logout error: ${error.message}`);
        return c.json({ success: false, message: "Logout failed", error: error.message }, 500);
    }
};
