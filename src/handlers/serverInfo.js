import { logInfo } from "../utils/logger.js";

const handleServerInfo = async (c) => {
    const serverInfo = {
        domainServer: Bun.env.BASE_URL,
        webServer: Bun.env.WEB_SERVER,
        portServer: Bun.env.PORT,
        descServer: Bun.env.DESC_SERVER,
        pathAPI: Bun.env.PATH_API,
        apiVersion: Bun.env.API_VERSION,
        developer: Bun.env.DEVELOPER,
        personalWeb: Bun.env.PERSONAL_WEB,
        frameworkVersion: require("../../package.json").dependencies.hono,
    };
    logInfo(`API ${Bun.env.PATH_API}/info diakses`);
    return c.json(serverInfo);
};

export default handleServerInfo;
