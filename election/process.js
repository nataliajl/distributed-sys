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
    logger.debug('Here are the processes:', this.processes);
    const process = this.processes.find((process) => {
      if (process.id == id) return process;
    });
    logger.debug('Current coordinator: ', this.coordinator);
    this.coordinator = process;
    if (id != this.id) {
      this.isCoordinator = false;
      logger.debug('I am not the coordinator anymore');
    }

    logger.debug('updated coordinator: ', this.coordinator);
  }

  async pingCoordinator() {
    if (!this.isCoordinator) {
      const url = `${this.coordinator.url}/ping`;
      logger.info(
        `The process ${this.id} is verifying the coordinator availability`
      );
      logger.info(`url: ${url}`);
      fetch(url, {
        method: 'GET',
      }).catch(() => this.callElection());
    }
  }

  async updateProcesses(addresses) {
    addresses.forEach((address, id) => {
      this.processes.push({ id: id, url: address });
    });

    logger.debug(this.processes);
  }

  declareMyselfAsCoordinator() {
    this.isCoordinator = true;
    logger.info("I'm the coordinator now! I'll tell everybody");

    this.processes.forEach((process) => {
      fetch(`${process.url}/news`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({ id: this.id }),
      }).catch((err) => logger.error(err.message));
    });
  }

  async callElection() {
    logger.info('Election called by me, the process ', this.id);
    new Promise((resolve, reject) => {
      this.processes.forEach(async (process) => {
        if (process.id > this.id) {
          await fetch(`${process.url}/election`, { method: 'GET' })
            .then((response) => {
              const status = response.status;
              logger.info(
                `The process ${process.id} returned the status: ${status}`
              );
              if (status == 200) {
                resolve(false); // not elected if receive response
              }
            })
            .catch((err) => logger.error(err.message));
        }
      });
      resolve(true);
    })
      .then(
        (resolve) => {
          logger.debug(`Declare myself as coordinator - ${resolve}`);
          if (resolve == true) {
            this.declareMyselfAsCoordinator();
          }
        },
        (reject) => {
          logger.debug(
            `Okay, maybe it is not my time to be a coordinator - ${reject}`
          );
        }
      )
      .catch((err) => logger.error(err.message));
  }
}

export default Process;
