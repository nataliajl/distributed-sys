import schedule from 'node-schedule';
import dotenv from 'dotenv';
import logger from '../log.js';

dotenv.config();

class MyWorker {
  constructor() {}

  async start(proccess) {
    schedule.scheduleJob('*/5 * * * * *', async function () {
      if (!proccess.isCoordinator) {
        logger.info(`I'm pinging the coordinator: `, proccess.coordinator);
        proccess.pingCoordinator();
      }
    });
  }
}

export default MyWorker;
