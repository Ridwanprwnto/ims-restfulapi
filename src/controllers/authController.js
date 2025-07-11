import { getUserByUsername } from "../models/userModel.js";
import { logInfo, logError } from "../utils/logger.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

export const login = async (c) => {
    const { username, password } = await c.req.json();
    try {
        if (!username || !password) {
            logError("Gagal: No username and password data request");
            return c.json({ success: false, message: `Gagal: username and password are required` }, 404);
        }
        const user = await getUserByUsername(username);

        if (!user) {
            logInfo(`Login gagal: user ${username} tidak ditemukan.`);
            return c.json({ success: false, message: `User ${username} tidak ditemukan` }, 404);
        }

        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            logInfo(`Login gagal: password salah untuk user ${username}.`);
            return c.json({ success: false, message: "Password salah" }, 401);
        }

        if (user.id_department == "" || user.id_department == null) {
            logInfo(`Login gagal: departemen user ${username} belum terdaftar.`);
            return c.json({ success: false, message: `departemen ${username} belum terdaftar` }, 401);
        }

        if (user.id_divisi == "" || user.id_divisi == null) {
            logInfo(`Login gagal: divisi user ${username} belum terdaftar.`);
            return c.json({ success: false, message: `divisi ${username} belum terdaftar` }, 401);
        }

        if (user.id_level == "" || user.id_level == null) {
            logInfo(`Login gagal: level user ${username} belum terdaftar.`);
            return c.json({ success: false, message: `level ${username} belum terdaftar` }, 401);
        }

        if (user.id_group == "" || user.id_group == null) {
            logInfo(`Login gagal: group user ${username} belum terdaftar.`);
            return c.json({ success: false, message: `group ${username} belum terdaftar` }, 401);
        }

        if (user.status == "N") {
            logInfo(`Login gagal: akses login user ${username} dinonaktifkan.`);
            return c.json({ success: false, message: `akses login ${username} dinonaktifkan` }, 401);
        }

        const token = jwt.sign({ id: user.nik.toString(), username: user.username }, Bun.env.JWT_SECRET, { expiresIn: "1h" });

        logInfo(`Login berhasil untuk user ${username}`);
        return c.json({
            success: true,
            token: token,
            user: {
                id: user.nik.toString(),
                username: user.username,
                officeCode: user.id_office,
                deptCode: user.id_department,
                divCode: user.id_divisi,
                groupId: user.id_group,
                officeName: user.office_name,
                deptName: user.department_name,
                divName: user.divisi_name,
                groupName: user.group_name,
            },
        });
    } catch (error) {
        logError(`Login error: ${error.message}`);
        return c.json({ success: false, message: "Terjadi kesalahan saat login" }, 500);
    }
};

export const validationController = async (c) => {
    const userData = c.get("user");
    const now = Math.floor(Date.now() / 1000);

    if (!userData || !userData.username) {
        return c.json({ success: false, message: "Token tidak valid atau tidak ada." }, 401);
    }
    const isExpired = userData.exp && userData.exp < now;

    const user = await getUserByUsername(userData.username);

    if (!user) {
        logInfo(`Validasi token gagal: user ${user.username} tidak ditemukan.`);
        return c.json({ success: false, message: `User ${user.username} tidak ditemukan` }, 404);
    }

    let newToken = null;

    if (isExpired) {
        newToken = jwt.sign({ id: user.nik.toString(), username: user.username }, Bun.env.JWT_SECRET, { expiresIn: "1h" });
        logInfo(`Token expired. Token diperbarui untuk user ${user.username}`);
    } else {
        logInfo(`Token masih valid untuk user ${user.username}`);
    }

    return c.json({
        success: true,
        ...(newToken && { token: newToken }),
        message: "Access granted",
        user: {
            id: user.nik.toString(),
            username: user.username,
            officeCode: user.id_office,
            deptCode: user.id_department,
            divCode: user.id_divisi,
            groupId: user.id_group,
            officeName: user.office_name,
            deptName: user.department_name,
            divName: user.divisi_name,
            groupName: user.group_name,
        },
    });
};
