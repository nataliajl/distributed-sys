import Process from './process.js';
import logger from '../log.js';
import express from 'express';
import dotenv from 'dotenv';
import http from 'http';

dotenv.config();

(() => {
  const app = express();
  const router = express.Router();
  const server = http.createServer(app);
  const port = process.env.PORT || 9898;
  const myProcess = new Process(process.env.PROCESS_NAME);

  router.get('/resource/:process', async (req, res) => {
    logger.info(`Resource accessed by ${req.params.process}`);
    res.json(`${myProcess.name} resource accessed `);
  });

  router.post('/queue', async (req, res) => {
    myProcess.addTask();
    res.json(`Process ${myProcess.name} queue - ${myProcess.task}`);
  });

  router.post('/queue/:number', async (req, res) => {
    const number = req.params.number;
    myProcess.addTask(number);
    res.json(`Process ${myProcess.name} queue - ${myProcess.task}`);
  });

  router.post('/token', async (req, res) => {
    res.json(`Token possession - Process ${myProcess.name}`);
    myProcess.setToken();
    await myProcess.accessResource(
      process.env.RESOURCE_ADDRESS,
      process.env.PROCESS_TIME
    );
    await myProcess.releaseToken(process.env.OTHER_PROCESS_ADDRESS);
  });

  // Default
  app.use('/', router);

  server.listen(port, async function () {
    logger.info(`Listening on http://localhost:${port}`);
  });
})();
