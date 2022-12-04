import schedule from 'node-schedule';
import dotenv from 'dotenv';

dotenv.config();

class MyWorker {
  constructor() {}

  async start(proccess) {
    schedule.scheduleJob('*/5 * * * * *', async function () {
      if (!proccess.isCoordinator) {
        console.log('alo: ', proccess.isCoordinator);
        proccess.pingCoordinator();
      }
    });
  }
}

export default MyWorker;
