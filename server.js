import Lamport from "./lamport.js";
import fetch from "node-fetch";
import express from "express";
import dotenv from 'dotenv';
import http from "http";
import os from 'os';

dotenv.config();

(() => {
  const clock = new Lamport();
  const app = express();
  const server = http.createServer(app);
  const port = process.env.PORT || 9898;
  const router = express.Router();

  
  router.get('/hello/:timestamp', async (req, res) => {
    clock.tick();
    console.log('Host: '+ os.networkInterfaces().lo[0].address +' - tickstamp: '+ clock.timestamp);
    clock.tack(req.params.timestamp);
    const communicate = await fetch(process.env.ADDRESS +'/hello/'+ clock.timestamp, {method: 'get'})
                                    .then(function (response){
                                      return response;
                                    })
                                    .catch(function (err){
                                      console.error(err);
                                    });
    console.log('Host: '+ os.networkInterfaces().lo[0].address +' - tackstamp: '+ clock.timestamp);
  });

  app.use('/', router);

  server.listen(port, async function () {
    console.log(`Listening on http://localhost:${port}`);
  });

})();