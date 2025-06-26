import { pool } from '../config/db.js';
import { logError } from '../utils/logger.js';

export const getDraftSO = async (office, department) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const query = `SELECT no_so, tgl_so FROM head_stock_opname WHERE office_so = ? AND dept_so = ? AND jenis_so = ? AND status_so = ?`;
    const rows = await conn.query(query, [office, department, 1, 'N']);
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
    const query = `SELECT A.pluid_so, A.asset_so, B.tgl_so, C.NamaBarang, D.NamaJenis FROM detail_stock_opname AS A 
    INNER JOIN head_stock_opname AS B ON A.no_so_head = B.no_so
    INNER JOIN mastercategory AS C ON LEFT(A.pluid_so, 6) = C.IDBarang
    INNER JOIN masterjenis AS D ON RIGHT(A.pluid_so, 4) = D.IDJenis
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

export const getUpdateSO = async (noref, noid) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const query = `SELECT A.pluid_so_asset, A.sn_so_asset, A.noat_so_asset, B.NamaBarang, C.NamaJenis FROM asset_stock_opname AS A 
    INNER JOIN mastercategory AS B ON LEFT(A.pluid_so_asset, 6) = B.IDBarang
    INNER JOIN masterjenis AS C ON RIGHT(A.pluid_so_asset, 4) = C.IDJenis
    WHERE A.noref_so_asset = ? AND A.sn_so_asset = ? OR A.noref_so_asset = ? AND A.noat_so_asset = ?`;
    const rows = await conn.query(query, [noref, noid, noref, noid]);
    return rows;
  } catch (err) {
    logError(`Database error: ${err.message}`);
    throw new Error('Database error: ' + err.message);
  } finally {
    if (conn) conn.release();
  }
};

export const getPresentaseSO = async (noref) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const query = `SELECT SUM(IF(kondisi_so_asset IS NOT NULL, 1, 0)) AS totalUpdate, COUNT(noref_so_asset) AS totalAsset FROM asset_stock_opname WHERE noref_so_asset = ?`;
    const rows = await conn.query(query, [noref]);

    return rows;
  } catch (err) {
    logError(`Database error: ${err.message}`);
    throw new Error('Database error: ' + err.message);
  } finally {
    if (conn) conn.release();
  }
};