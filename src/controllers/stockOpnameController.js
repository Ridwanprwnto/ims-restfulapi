import { getDraftSO, getItemSO } from '../models/stockOpnameModel.js';
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