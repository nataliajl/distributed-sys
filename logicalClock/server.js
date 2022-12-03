import localClock from './localClock.js';
import Lamport from "./lamport.js";
import fetch from "node-fetch";
import express from "express";
import dotenv from 'dotenv';
import http from "http";

dotenv.config();
const clock = new Lamport();
const local = localClock(clock);


const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
(() => {
  const app = express();
  const server = http.createServer(app);
  const port = process.env.PORT || 9898;
  const router = express.Router();

  local.increment();
    
  // Lamport

  router.get('/hello', async (req, res) => {
    clock.tick();
    console.log('tick - '+ clock.timestamp);
    const communicate = fetch(process.env.ADDRESS +'/hello/'+ clock.timestamp, {method: 'get'})
                                    .then(function (response){
                                      return response;
                                    })
                                    .catch(function (err){
                                      console.error(err);
                                    });
  });

  router.get('/hello/:timestamp', async (req, res) => {
    clock.tick();
    console.log('*tick* - '+ clock.timestamp);
    await delay(process.env.FLUTTER); /// waiting 1 second.
    clock.tack(req.params.timestamp);
    const communicate = fetch(process.env.ADDRESS +'/hello/'+ clock.timestamp, {method: 'get'})
                                    .then(function (response){
                                      return response;
                                    })
                                    .catch(function (err){
                                      console.error(err);
                                    });
    console.log('**TACK** - '+ clock.timestamp);  
  });

  // Default
  app.use('/', router);

  server.listen(port, async function () {
    console.log(`Listening on http://localhost:${port}`);
  });

})();