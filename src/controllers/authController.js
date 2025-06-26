import { getUserByUsername } from "../models/userModel.js";
import { logInfo, logError } from "../utils/logger.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from 'dotenv';

dotenv.config();

export const login = async (c) => {
    try {
        const { username, password } = await c.req.json();
        const user = await getUserByUsername(username);

        if (!user) {
            logInfo(`Login gagal: user ${username} tidak ditemukan.`);
            return c.json({ success: false, error: "User tidak ditemukan" }, 404);
        }

        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            logInfo(`Login gagal: password salah untuk user ${username}.`);
            return c.json({ success: false, error: "Password salah" }, 401);
        }

        if (user.id_department == "" || user.id_department == null) {
            logInfo(`Login gagal: departemen user ${username} belum terdaftar.`);
            return c.json({ success: false, error: `departemen ${username} belum terdaftar` }, 401);
        }

        if (user.id_divisi == "" || user.id_divisi == null) {
            logInfo(`Login gagal: divisi user ${username} belum terdaftar.`);
            return c.json({ success: false, error: `divisi ${username} belum terdaftar` }, 401);
        }

        if (user.id_level == "" || user.id_level == null) {
            logInfo(`Login gagal: level user ${username} belum terdaftar.`);
            return c.json({ success: false, error: `level ${username} belum terdaftar` }, 401);
        }

        if (user.id_group == "" || user.id_group == null) {
            logInfo(`Login gagal: group user ${username} belum terdaftar.`);
            return c.json({ success: false, error: `group ${username} belum terdaftar` }, 401);
        }

        if (user.status == "N") {
            logInfo(`Login gagal: akses login user ${username} dinonaktifkan.`);
            return c.json({ success: false, error: `akses login ${username} dinonaktifkan` }, 401);
        }

        const token = jwt.sign({ id: user.nik.toString(), username: user.username }, Bun.env.JWT_SECRET, { expiresIn: "1h" });

        logInfo(`Login berhasil untuk user ${username}`);
        return c.json({
            success: true,
            token: token,
            user: {
                id: user.nik.toString(),
                username: user.username,
                officecode: user.id_office,
                deptcode: user.id_department,
                divcode: user.id_divisi,
                groupid: user.id_group,
            },
        });
    } catch (error) {
        logError(`Login error: ${error.message}`);
        return c.json({ success: false, error: "Terjadi kesalahan saat login" }, 500);
    }
};

export const validationController = async (c) => {
    const userId = c.get("user");

    const user = await getUserByUsername(userId.username);

    if (!user) {
        logInfo(`Validasi token gagal: user ${userId.username} tidak ditemukan.`);
        return c.json({ success: false, error: "User tidak ditemukan" }, 404);
    }

    const newToken = jwt.sign({ id: user.nik.toString(), username: user.username }, Bun.env.JWT_SECRET, { expiresIn: "1h" });

    logInfo(`Berhasil validasi token untuk user ${user.username}`);
    return c.json({
        success: true,
        token: newToken,
        message: "Access granted",
        user: {
            id: user.nik.toString(),
            username: user.username,
            officecode: user.id_office,
            deptcode: user.id_department,
            divcode: user.id_divisi,
            groupid: user.id_group,
        },
    });
};
