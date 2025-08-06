import { pool } from "../../config/db.js";

export const getUserByUsername = async (username) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `SELECT A.*, B.office_name, C.department_name, D.divisi_name, E.group_name FROM users AS A
        INNER JOIN office AS B ON A.id_office = B.id_office 
        INNER JOIN department AS C ON A.id_department = C.id_department
        INNER JOIN divisi AS D ON A.id_divisi = D.id_divisi
        INNER JOIN groups AS E ON A.id_group = E.id_group
        WHERE A.username = ?`;
        const rows = await conn.query(query, [username]);
        return rows[0];
    } catch (err) {
        throw new Error("Database error: " + err.message);
    } finally {
        if (conn) conn.release();
    }
};
