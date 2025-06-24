import { pool } from '../config/db.js';
import { logError } from '../utils/logger.js';

export const getDraftSO = async (office, department) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT no_so, tgl_so FROM head_stock_opname WHERE office_so = ? AND dept_so = ? AND jenis_so = ? AND status_so = ?', [office, department, 1, 'N']);
    return rows;
  } catch (err) {
    logError(`Database error: ${err.message}`);
    throw new Error('Database error: ' + err.message);
  } finally {
    if (conn) conn.release();
  }
};