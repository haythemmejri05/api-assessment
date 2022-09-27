import app from "./server.js";
import logger from "./utils/logger.js";
import config from './config/config.js';

app.listen(config.port, () => {
    logger.info(`Server starting at http://localhost:${config.port}...`);
});