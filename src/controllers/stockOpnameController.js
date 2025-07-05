import { getDraftSO, getItemSO, getUpdateSO, getPresentaseSO, postUpdateSO, getCheckPhotoSO } from "../models/stockOpnameModel.js";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { logInfo, logError } from "../utils/logger.js";
import { deleteFile } from "../utils/fileHelper";

export const draftSOController = async (c) => {
    const { office, department } = await c.req.json();
    try {
        if (!office || !department) {
            logError("Gagal: No office and dept data request");
            return c.json({ success: false, message: `Gagal: office and dept are required` }, 404);
        }

        const dataDraftSO = await getDraftSO(office, department);

        if (!dataDraftSO || dataDraftSO.length === 0) {
            logInfo(`No draft SO found`);
            return c.json({ success: false, message: "No draft SO found" }, 404);
        }

        const groupedResponse = dataDraftSO.reduce((acc, item) => {
            const key = `${item.no_so}-${item.tgl_so}`;

            const date = new Date(item.tgl_so);
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            const formattedDate = `${day}-${month}-${year}`;

            if (!acc[key]) {
                acc[key] = {
                    noRefSO: item.no_so,
                    tglSO: formattedDate,
                    itemsSO: item.NamaBarang + " " + item.NamaJenis,
                };
            } else {
                acc[key].itemsSO += `, ${item.NamaBarang} ${item.NamaJenis}`;
            }
            return acc;
        }, {});

        const response = Object.values(groupedResponse);

        for (const item of response) {
            const presentaseData = await getPresentaseSO(item.noRefSO);
            const totalUpdate = presentaseData[0]?.totalUpdate || 0;
            const totalAsset = presentaseData[0]?.totalAsset || 1; // Menghindari pembagian dengan nol
            const totalUpdateNumber = Number(totalUpdate);
            const totalAssetNumber = Number(totalAsset);
            item.persentaseSO = `${((totalUpdateNumber * 100) / totalAssetNumber).toFixed(2)}%`;
        }

        logInfo(`data draft opname found`);
        return c.json({ success: true, data: response }, 200);
    } catch (err) {
        logError(`Gagal: `, err);
        return c.json({ success: false, message: "Failed to fetch draft SO", error: err.message }, 500);
    }
};

export const itemSOController = async (c) => {
    const { noref } = await c.req.json();
    try {
        if (!noref) {
            logError("Gagal: No ref data request");
            return c.json({ success: false, message: `Gagal: Noref are required` }, 404);
        }
        const dataItemSO = await getItemSO(noref);

        if (!dataItemSO || dataItemSO.length === 0) {
            logInfo(`No data item SO found`);
            return c.json({ success: false, message: "No data item SO found" }, 404);
        }

        const formatDate = (dateString) => {
            const date = new Date(dateString);
            const options = { day: "2-digit", month: "2-digit", year: "numeric" };
            return date.toLocaleDateString("id-ID", options);
        };

        const response = dataItemSO.map((item) => ({
            idBarang: item.pluid_so,
            descBarang: item.NamaBarang + " " + item.NamaJenis,
            assetBarang: item.asset_so,
        }));

        logInfo(`data item opname ditemukan`);
        return c.json(
            {
                success: true,
                date: formatDate(dataItemSO[0].tgl_so),
                data: response,
            },
            200
        );
    } catch (err) {
        logError(`Gagal: `, err);
        return c.json({ success: false, message: "Failed to fetch draft item SO", error: err.message }, 500);
    }
};

export const updateSOController = async (c) => {
    const { noref, noid } = await c.req.json();
    try {
        if (!noref || !noid) {
            logError("Gagal: No ref and id data request");
            return c.json({ success: false, message: `Gagal: Noref and id are required` }, 404);
        }

        const dataUpdateSO = await getUpdateSO(noref, noid);

        if (!dataUpdateSO || dataUpdateSO.length === 0) {
            logInfo(`Gagal: Item ID ${noid} noref ${noref} not found`);
            return c.json({ success: false, message: `Item ID ${noid} noref ${noref} not found` }, 404);
        }

        const response = dataUpdateSO.map((item) => ({
            idBarang: item.pluid_so_asset,
            descBarang: item.NamaBarang + " " + item.NamaJenis,
            snBarang: item.sn_so_asset,
            datBarang: item.noat_so_asset,
            konBarang: item.kondisi_so_asset ? true : false,
        }));

        logInfo(`Data opname ID ${noid} noref ${noref} found`);
        return c.json(
            {
                success: true,
                data: response,
            },
            200
        );
    } catch (err) {
        logError(`Gagal: `, err);
        return c.json({ success: false, message: `Failed to fetch item ${noid} noref ${noref}`, error: err.message }, 500);
    }
};

export const persentaseSOController = async (c) => {
    const { noref } = await c.req.json();
    try {
        if (!noref) {
            logError("Gagal: No ref data request");
            return c.json({ success: false, message: `Gagal: Noref are required` }, 404);
        }

        const dataPersentaseSO = await getPresentaseSO(noref);

        if (!dataPersentaseSO || dataPersentaseSO.length === 0) {
            logInfo(`Gagal: Noref ${noref} not found`);
            return c.json({ success: false, message: `Gagal: Noref ${noref} not found` }, 404);
        }

        const response = dataPersentaseSO.map((item) => ({
            itemUpdate: item.totalUpdate ? item.totalUpdate : "0",
            itemDraft: item.totalAsset.toString(),
        }));

        logInfo(`Data opname noref ${noref} found`);
        return c.json(
            {
                success: true,
                data: response,
            },
            200
        );
    } catch (err) {
        logError(`Gagal: `, err);
        return c.json({ success: false, message: `Failed to fetch opname noref ${noref}`, error: err.message }, 500);
    }
};

export const saveSOController = async (c) => {
    const { noref, nocode, noid, condition, location, user, photo } = await c.req.json();
    try {
        if (!noref || !nocode || !noid || !condition || !location || !user) {
            logError("Gagal: No ref, code, id, kondisi, and lokasi are required");
            return c.json({ success: false, message: `Gagal: ref, code, id, kondisi, and lokasi are required` }, 404);
        }

        let savedFilename = null;

        const oldPhotoFilename = await getOldPhotoFilename(noref, nocode, noid);

        if (photo && photo.startsWith("data:image/")) {
            const matches = photo.match(/^data:image\/(\w+);base64,(.+)$/);
            if (matches) {
                const ext = matches[1];
                const base64Data = matches[2];
                const buffer = Buffer.from(base64Data, "base64");

                const filename = `photo-${Date.now()}-${randomUUID()}.${ext}`;
                const filepath = path.resolve("files/opname", filename);

                await writeFile(filepath, buffer);
                savedFilename = filename;
                if (oldPhotoFilename) {
                    const oldFilePath = path.join("files/opname", oldPhotoFilename);
                    await deleteFile(oldFilePath);
                }
            }
        } else {
            if (oldPhotoFilename && photo === null) {
                const oldFilePath = path.join("files/opname", oldPhotoFilename);
                await deleteFile(oldFilePath);
            }
        }

        function getLocalDatetimeSQL(offsetHours = 7) {
            const localTime = new Date(Date.now() + offsetHours * 60 * 60 * 1000);
            return localTime.toISOString().slice(0, 19).replace("T", " ");
        }
        const formattedDatetime = getLocalDatetimeSQL();

        const result = await postUpdateSO(noref, nocode, noid, condition, location, user, savedFilename, formattedDatetime);
        const response = await getPresentaseSO(noref);

        const dataPersentaseSO = response.map((item) => ({
            itemUpdate: item.totalUpdate ? item.totalUpdate : "0",
            itemDraft: item.totalAsset.toString(),
        }));

        logInfo(`Ref ${noref} id ${nocode} sn ${noid} recorded successfully`);
        return c.json(
            {
                success: true,
                message: result,
                data: dataPersentaseSO,
            },
            200
        );
    } catch (err) {
        logError(`Gagal: `, err);
        return c.json({ success: false, message: `Failed to fetch item ${noid} noref ${noref}`, error: err.message }, 500);
    }
};

// Fungsi untuk mendapatkan nama file foto lama
async function getOldPhotoFilename(noref, nocode, noid) {
    try {
        const rows = await getCheckPhotoSO(noref, nocode, noid);
        return rows?.photo_so_asset || null;
    } catch (error) {
        logError(`Error getting old photo filename:`, error);
        return null;
    }
}
