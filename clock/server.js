import Process from './process.js';
import logger from '../log.js';
import express from 'express';
import dotenv from 'dotenv';
import https from 'https';

dotenv.config();

(() => {
  const app = express();
  const router = express.Router();
  const server = https.createServer(app);
  const port = process.env.PORT || 9898;
  const myProcess = new Process(process.env.PROCESS_NAME);

  myProcess.startClock();

  // Lamport
  router.get('/hello', async (req, res) => {
    myProcess.startEvent(process.env.OTHER_PROCESS_ADDRESS);
    res.json(`Greetings from ${myProcess.name}!`);
  });

  router.get('/hello/:timestamp', async (req, res) => {
    myProcess.worker(process.env.PROCESS_TIME);
    myProcess.event(req.params.timestamp, process.env.OTHER_PROCESS_ADDRESS);
    res.json(`Greetings from ${myProcess.name}!`);
  });

  // Default
  app.use('/', router);

  server.listen(port, async function () {
    logger.info(`Listening on https://localhost:${port}`);
  });
})();
