import { pool } from '../config/db.js';

export const getKondisiModel = async () => {
  let conn;
  try {
    conn = await pool.getConnection();
    const query = `SELECT id_kondisi, kondisi_name FROM kondisi WHERE kondisi_name != ?`;
    const rows = await conn.query(query, ['MUSNAH']);
    return rows;
  } catch (err) {
    throw new Error('Database error: ' + err.message);
  } finally {
    if (conn) conn.release();
  }
};