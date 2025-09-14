import { getUserByUsername } from "../../models/sobi/userModel.js";
import { logInfo } from "../../utils/logger.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const tokenController = async (c) => {
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
            email: user.email,
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
