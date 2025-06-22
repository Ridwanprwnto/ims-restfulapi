import { pool } from '../config/db.js';

export const getUserByUsername = async (username) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
  } catch (err) {
    throw new Error('Database error: ' + err.message);
  } finally {
    if (conn) conn.release();
  }
};