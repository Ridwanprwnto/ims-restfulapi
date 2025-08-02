import { logInfo } from "../utils/logger.js";

const handleServerInfo = async (c) => {
    const serverInfo = {
        domainServer: Bun.env.BASE_URL,
        webServer: Bun.env.WEB_SERVER,
        portServer: Bun.env.PORT,
        descServer: Bun.env.DESC_SERVER,
        pathAPI: Bun.env.PATH_API + Bun.env.PATH_API_INFO,
        apiVersion: Bun.env.API_VERSION,
        frameworkVersion: require("../../package.json").dependencies.hono,
    };
    logInfo(`API ${Bun.env.PATH_API_INFO} diakses`);
    return c.json(serverInfo);
};

export default handleServerInfo;
