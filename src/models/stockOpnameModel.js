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

export const getItemSO = async (noref) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const query = `SELECT A.pluid_so, A.asset_so, B.NamaBarang, C.NamaJenis FROM detail_stock_opname AS A 
    INNER JOIN mastercategory AS B ON LEFT(A.pluid_so, 6) = B.IDBarang
    INNER JOIN masterjenis AS C ON RIGHT(A.pluid_so, 4) = C.IDJenis
    WHERE A.no_so_head = ?`;
    const rows = await conn.query(query, [noref]);
    return rows;
  } catch (err) {
    logError(`Database error: ${err.message}`);
    throw new Error('Database error: ' + err.message);
  } finally {
    if (conn) conn.release();
  }
};