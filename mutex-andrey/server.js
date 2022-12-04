import Action from "./action.js";
import Token from "./token.js";
import express from "express";
import dotenv from 'dotenv';
import http from "http";

dotenv.config();
const token = new Token();
const action = new Action();

(() => {
  const app = express();
  const server = http.createServer(app);
  const port = process.env.PORT || 9898;
  const router = express.Router();

  
  // Mutex

  router.post('/receive-token', async (req, res) => {
    console.log("/receive-token")
    token.receiveToken();
    action.performMissedActions(token);
    token.tryToPassToken(process.env.ADDRESS);
  });
  
  // It will try to perform the first action that is allowed for anyone who owns 
  // the token
  router.get('/open-spotify', async (req, res) => {
    console.log("/open-spotify")
    action.openSpotify(token);
  });
  
  // It will try to perform a second action that is allowed for anyone who owns 
  // the token
  router.get('/open-a-file', async (req, res) => {
    console.log("/open-a-file")
    action.modifyAFile(token);
  });

  // Default
  app.use('/', router);

  server.listen(port, async function () {
    console.log(`Listening on http://localhost:${port}`);
  });

})();