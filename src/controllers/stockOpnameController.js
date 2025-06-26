import { getDraftSO, getItemSO, getUpdateSO, getPresentaseSO } from '../models/stockOpnameModel.js';
import { logInfo, logError } from '../utils/logger.js';

export const draftSOController = async (c) => {
    const { office, department } = await c.req.json();
    try {
        const dataSO = await getDraftSO(office, department);

        if (!dataSO || dataSO.length === 0) {
            logInfo(`No draft SO found`);
            return c.json(
                { success: false, message: 'No draft SO found' },
                404
            );
        }

        logInfo(`data draft opname ditemukan`);
        return c.json(
            { success: true, data: dataSO },
            200
        );

    } catch (err) {
        logError(`Gagal: `, err);
        return c.json(
            { success: false, message: 'Failed to fetch draft SO', error: err.message },
            500
        );
    }
};

export const itemSOController = async (c) => {
    const { noref } = await c.req.json();
    try {
        const dataItemSO = await getItemSO(noref);

        if (!dataItemSO || dataItemSO.length === 0) {
            logInfo(`No data item SO found`);
            return c.json(
                { success: false, message: 'No data item SO found' },
                404
            );
        }

        const response = dataItemSO.map(item => ({
            idBarang: item.pluid_so,
            descBarang: item.NamaBarang +' '+ item.NamaJenis,
            assetBarang: item.asset_so
        }));
        
        logInfo(`data item opname ditemukan`);
        return c.json(
            { 
                success: true,
                date: dataItemSO[0].tgl_so,
                data: response
            }, 
            200
        );

    } catch (err) {
        logError(`Gagal: `, err);
        return c.json(
            { success: false, message: 'Failed to fetch draft item SO', error: err.message },
            500
        );
    }
};

export const updateSOController = async (c) => {
    const { noref, noid } = await c.req.json();
    try {
        const dataUpdateSO = await getUpdateSO(noref, noid);

        if (!dataUpdateSO || dataUpdateSO.length === 0) {
            logInfo(`Gagal: Item ID ${noid} noref ${noref} not found`);
            return c.json(
                { success: false, message: `Item ID ${noid} noref ${noref} not found` },
                404
            );
        }

        const response = dataUpdateSO.map(item => ({
            idBarang: item.pluid_so_asset,
            descBarang: item.NamaBarang+' '+item.NamaJenis,
            snBarang: item.sn_so_asset,
            datBarang: item.noat_so_asset
        }));

        logInfo(`Data opname ID ${noid} noref ${noref} found`);
        return c.json(
            { 
                success: true,
                data: response
            }, 
            200
        );

    } catch (err) {
        logError(`Gagal: `, err);
        return c.json(
            { success: false, message: `Failed to fetch item ${noid} noref ${noref}`, error: err.message },
            500
        );
    }
};

export const persentaseSOController = async (c) => {
    const { noref } = await c.req.json();
    try {
        const dataPersentaseSO = await getPresentaseSO(noref);

        if (!dataPersentaseSO || dataPersentaseSO.length === 0) {
            logInfo(`Gagal: Noref ${noref} not found`);
            return c.json(
                { success: false, message: `Gagal: Noref ${noref} not found` },
                404
            );
        }

        const response = dataPersentaseSO.map(item => ({
            itemUpdate: item.totalUpdate.toString(),
            itemDraft: item.totalAsset.toString()
        }));

        logInfo(`Data opname noref ${noref} found`);
        return c.json(
            { 
                success: true,
                data: response
            }, 
            200
        );

    } catch (err) {
        logError(`Gagal: `, err);
        return c.json(
            { success: false, message: `Failed to fetch opname noref ${noref}`, error: err.message },
            500
        );
    }
};