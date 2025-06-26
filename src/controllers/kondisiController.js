import { getUserByUsername } from "../models/userModel.js";
import { getKondisiModel } from "../models/kondisiModel.js";
import { logInfo, logError } from "../utils/logger.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

export const kondisiController = async (c) => {
    const userData = c.get("user");
    const now = Math.floor(Date.now() / 1000);

    if (!userData || !userData.username) {
        return c.json({ success: false, error: "Token tidak valid atau tidak ada." }, 401);
    }

    const isExpired = userData.exp && userData.exp < now;

    const user = await getUserByUsername(userData.username);

    if (!user) {
        logInfo(`Validasi token gagal: user ${user.username} tidak ditemukan.`);
        return c.json({ success: false, error: "User tidak ditemukan" }, 404);
    }

    let newToken = null;

    if (isExpired) {
        newToken = jwt.sign(
            { id: user.nik.toString(), username: user.username },
            Bun.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        logInfo(`Token expired. Token diperbarui untuk user ${user.username}`);
    } else {
        logInfo(`Token masih valid untuk user ${user.username}`);
    }

    const kondisi = await getKondisiModel();

    if (!kondisi) {
        logInfo(`Gagal: Data kondisi tidak ditemukan.`);
        return c.json({ success: false, error: "Data kondisi tidak ditemukan" }, 404);
    }

    const response = kondisi.map(item => ({
        idKondisi: item.id_kondisi,
        nameKondisi: item.kondisi_name
    }));

    return c.json({
        success: true,
        ...(newToken && { token: newToken }),
        message: "Access granted",
        kondisi: response
    });
};
