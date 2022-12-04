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
  //TODO: COLOCAR ENDEREÇOS EM VARIAVEL NODE_ENV E MANDAR UPDATE PARA OUTRAS
  const processes = process.env.PROCESSES;
  const address = os.networkInterfaces().lo[0].address;
  const myProcess = new Process(process.env.PROCESS_ID, address);

  router.get(`/election`, async (req, res) => {
    await myProcess.callElection();
    res.json(`Process ${myProcess.id} called a election`);
  });

  router.post(`/news`, async (req, res) => {
    const newCoordinator = req.body;
    myProcess.setCoordinator(newCoordinator.id);
    res.status(200).json(`New coordinator - ${myProcess.coordinator}`);
  });

  router.get(`/ping`, async (req, res) => {
    res.json().status(200);
  });

  router.get(`/info`, async (req, res) => {
    res
      .json({
        id: myProcess.id,
        url: myProcess.url,
        isCoordinator: myProcess.isCoordinator,
      })
      .status(200);
  });

  // Default
  app.use(bodyParse.json());
  app.use(bodyParse.urlencoded({ extended: true }));
  app.use('/', router);

  server.listen(port, async function () {
    logger.info(`Listening on http://localhost:${port}`);
    myProcess.updateProcesses();

    myProcess.callElection();
  });
})();
