import schedule from 'node-schedule';
import fetch from 'node-fetch';
import logger from '../log.js';
import dotenv from 'dotenv';

dotenv.config();

class Process {
  constructor(id, url) {
    this.id = id;
    this.url = url;
    this.processes = [];
    this.isCoordinator = false;
    this.coordinator = {};
  }

  /**
   * @param {int} id
   */
  setCoordinator(id) {
    logger.debug(this.processes);
    const process = this.processes.find((process) => {
      if(process.id == id)
        return process;
    });
    
    this.coordinator = process;
    logger.debug(this.coordinator);
    if (id != this.id) {
      this.isCoordinator = false;
    }

    logger.debug(this.coordinator)
  }

  async updateProcesses(addresses) {
    addresses.forEach((address, id) => {
      this.processes.push({id: id, url: address});
    });

    logger.debug(this.processes);
  }

  async worker() {
    schedule.scheduleJob('*/5 * * * * *', async function () {
      if (!this.isCoordinator) 
        pingCoordinator();
      // updateProcesses();
    });
  }

  declareMyselfAsCoordinator() {
    this.isCoordinator = true;
    logger.info("I'm the coordinator now!");

    this.processes.forEach((process) => {
      fetch(`http://${process.url}/news`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({ id: this.id }),
      })
      .then((response) => response.json())
      .then((data) => logger.info(data))
      .catch((err) => logger.error(err.message));
    });
  }

  async callElection() {
    logger.info('Election called');
    new Promise((resolve, reject) => {
      this.processes.forEach(async (process) => {
        if (process.id > this.id) {
         await fetch(`http://${process.url}/election`, { method: 'GET' })
          .then((response) => {
              const status = response.status;
              logger.info(`Process ${process.id} response: ${status}`);
              logger.debug(status);
              if (status == 200) {
                resolve(false); // not elected if receive response
              }
            }
          )
          .catch((err) => logger.error(err.message));
        }
      });
      resolve(true);
    })
    .then((resolve) => {
      logger.debug(`Declare myself as coordinator - ${resolve}`);
      if (resolve == true) {
        this.declareMyselfAsCoordinator();
      }
    },
    (reject) => {
      logger.debug(`Declare myself as coordinator - ${reject}`);
    })
    .catch((err) => logger.error(err.message));
  }

  async pingCoordinator() {
    logger.info(
      `The process ${this.id} is verifying the coordinator availability`
    );
    const responseStatus = fetch(`${this.coordinator.url}/ping`, {
      method: 'GET',
    }).then((response) => response.status);
    if (responseStatus !== 200) {
      this.callElection();
    }
  }
}

export default Process;
