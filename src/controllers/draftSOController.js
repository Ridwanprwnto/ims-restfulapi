import { getDraftSO } from '../models/draftSOModel.js';
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