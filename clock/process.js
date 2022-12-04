import schedule from 'node-schedule';
import Lamport from './lamport.js';
import logger from '../log.js';
import fetch from 'node-fetch';

const clock = new Lamport();

class Process {
  constructor(name) {
    this.name = name;
    this.processing = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  }

  async worker(timing) {
    clock.tick();
    logger.info(`*TICK*: ${clock.timestamp}`);
    await this.processing(timing); // simulação de tempo de processamento
  }

  startClock() {
    schedule.scheduleJob('*/1 * * * * *', async function () {
      clock.tick();
      logger.debug(`Local Clock: ${clock.timestamp}`);
    });
  }

  startEvent(address) {
    clock.tick();
    this.send(address);
  }

  event(timestamp, address) {
    clock.tack(timestamp);
    this.send(address);
    logger.info(`**TACK**: ${clock.timestamp}`);
  }

  send(address) {
    fetch(`${address}/hello/${clock.timestamp}`, { method: 'GET' })
      .then((response) => response.json())
      .then((data) => console.log(data));
  }
}

export default Process;
