import log4js_extend from "log4js-extend";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import log4js from 'log4js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

log4js_extend(log4js, {
    path: __dirname,
    format: `at Process ${process.env.PROCESS_NAME}`
  });


const logger = log4js.getLogger("MC714-T2");
logger.level = 'info';


export default logger;