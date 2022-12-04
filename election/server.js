import Process from './process.js';
import logger from '../log.js';
import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import os from 'os';
import bodyParse from 'body-parser';
dotenv.config();

(() => {
  const app = express();
  const router = express.Router();
  const server = http.createServer(app);
  const port = process.env.PORT || 9898;
  const address = os.networkInterfaces().lo[0].address;
  const myProcess = new Process(process.env.PROCESS_ID, address);

  router.get(`/election`, async (req, res) => {
    await myProcess.callElection();
    res.json(`Process ${myProcess.id} called a election`);
  });

  router.post(`/news`, async (req, res) => {
    const newCoordinator = req.body;
    logger.debug(newCoordinator);
    myProcess.setCoordinator(newCoordinator.id);
    res.status(200).json(`New coordinator - ${myProcess.coordinator.id}`);
  });

  router.get(`/ping`, async (req, res) => {
    res.json().status(200);
  });

  router.get(`/info`, async (req, res) => {
    res.status(200).json({
        id: myProcess.id,
        url: myProcess.url,
        // isCoordinator: myProcess.isCoordinator,
      });
  });

  // Default
  app.use(bodyParse.json());
  app.use(bodyParse.urlencoded({ extended: true }));
  app.use('/', router);

  server.listen(port, async function () {
    logger.info(`Listening on http://localhost:${port}`);
    const processes = (process.env.PROCESS_ADDRESS).split(',');
    await myProcess.updateProcesses(processes);
    await myProcess.callElection();

  });
})();
