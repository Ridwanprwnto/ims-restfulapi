import { pool } from "../../config/db.js";
import { logError } from "../../utils/logger.js";
import path from "node:path";

export const getDraftSO = async (office, department) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `SELECT A.no_so, A.tgl_so, C.NamaBarang, D.NamaJenis FROM head_stock_opname AS A 
        INNER JOIN detail_stock_opname AS B ON A.no_so = B.no_so_head
        INNER JOIN mastercategory AS C ON LEFT(B.pluid_so, 6) = C.IDBarang
        INNER JOIN masterjenis AS D ON RIGHT(B.pluid_so, 4) = D.IDJenis
        WHERE A.office_so = ? AND A.dept_so = ? AND A.jenis_so = ? AND A.status_so = ? ORDER BY A.no_so ASC`;
        const rows = await conn.query(query, [office, department, 1, "N"]);
        return rows;
    } catch (err) {
        logError(`Database error: ${err.message}`);
        throw new Error("Database error: " + err.message);
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
        throw new Error("Database error: " + err.message);
    } finally {
        if (conn) conn.release();
    }
};

export const getUpdateSO = async (noref, noid) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `SELECT A.pluid_so_asset, A.sn_so_asset, A.noat_so_asset, A.kondisi_so_asset, B.NamaBarang, C.NamaJenis FROM asset_stock_opname AS A 
    INNER JOIN mastercategory AS B ON LEFT(A.pluid_so_asset, 6) = B.IDBarang
    INNER JOIN masterjenis AS C ON RIGHT(A.pluid_so_asset, 4) = C.IDJenis
    WHERE A.noref_so_asset = ? AND A.noat_so_asset = ? OR A.noref_so_asset = ? AND A.sn_so_asset = ?`;
        const rows = await conn.query(query, [noref, noid, noref, noid]);
        return rows;
    } catch (err) {
        logError(`Database error: ${err.message}`);
        throw new Error("Database error: " + err.message);
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
        throw new Error("Database error: " + err.message);
    } finally {
        if (conn) conn.release();
    }
};

export const getCheckPhotoSO = async (noref, nocode, noid) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `SELECT photo_so_asset FROM asset_stock_opname WHERE noref_so_asset = ? AND pluid_so_asset = ? AND sn_so_asset = ?`;
        const rows = await conn.query(query, [noref, nocode, noid]);
        return rows[0];
    } catch (err) {
        logError(`Database error: ${err.message}`);
        throw new Error("Database error: " + err.message);
    } finally {
        if (conn) conn.release();
    }
};

export const postUpdateSO = async (noref, nocode, noid, condition, location, user, savedFilename, datetime) => {
    let conn;
    try {
        conn = await pool.getConnection();

        const kondisi = condition.substring(0, 2);
        const lokasi = location.toUpperCase();
        const qty = 1;

        const [dataAssetRows] = await conn.query(`SELECT kondisi_so_asset, lokasi_so_asset FROM asset_stock_opname WHERE noref_so_asset = ? AND pluid_so_asset = ? AND sn_so_asset = ?`, [
            noref,
            nocode,
            noid,
        ]);

        const dataAsset = dataAssetRows;

        if (!dataAsset) throw new Error("Data asset tidak ditemukan");

        const kondisiOld = dataAssetRows.kondisi_so_asset;
        const lokasiOld = dataAssetRows.lokasi_so_asset;

        const [dataFisikRows] = await conn.query(`SELECT fisik_so FROM detail_stock_opname WHERE no_so_head = ? AND pluid_so = ?`, [noref, nocode]);
        const dataFisik = dataFisikRows;

        const dataQty = parseInt(dataFisik?.fisik_so || 0);

        let fisik;

        if (kondisiOld === null && lokasiOld === null) {
            if (kondisi !== "07") {
                fisik = dataQty + qty;
                await conn.query(`UPDATE detail_stock_opname SET fisik_so = ? WHERE no_so_head = ? AND pluid_so = ?`, [fisik, noref, nocode]);
            }
        } else {
            if (kondisiOld === "07") {
                if (kondisi !== "07") {
                    fisik = dataQty + qty;
                    await conn.query(`UPDATE detail_stock_opname SET fisik_so = ? WHERE no_so_head = ? AND pluid_so = ?`, [fisik, noref, nocode]);
                }
            } else {
                if (kondisi === "07") {
                    fisik = dataQty - qty;
                    await conn.query(`UPDATE detail_stock_opname SET fisik_so = ? WHERE no_so_head = ? AND pluid_so = ?`, [fisik, noref, nocode]);
                }
            }
        }

        let updateQuery, updateParams;

        if (savedFilename !== null) {
            updateQuery = `UPDATE asset_stock_opname 
                          SET kondisi_so_asset = ?, 
                              lokasi_so_asset = ?, 
                              user_so_asset = ?, 
                              photo_so_asset = ?, 
                              date_so_asset = ? 
                          WHERE noref_so_asset = ? AND pluid_so_asset = ? AND sn_so_asset = ?`;
            updateParams = [kondisi, lokasi, user, savedFilename, datetime, noref, nocode, noid];
        } else {
            updateQuery = `UPDATE asset_stock_opname 
                          SET kondisi_so_asset = ?, 
                              lokasi_so_asset = ?, 
                              user_so_asset = ?, 
                              photo_so_asset = NULL, 
                              date_so_asset = ? 
                          WHERE noref_so_asset = ? AND pluid_so_asset = ? AND sn_so_asset = ?`;
            updateParams = [kondisi, lokasi, user, datetime, noref, nocode, noid];
        }

        await conn.query(updateQuery, updateParams);

        const result = `Data Noref ${noref} ID ${nocode} SN ${noid} berhasil diperbarui`;
        return result;
    } catch (err) {
        logError(`Database error: ${err.message}`);
        throw new Error("Database error: " + err.message);
    } finally {
        if (conn) conn.release();
    }
};
