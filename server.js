const express = require("express");
const https = require("https");

(async () => {
  const app = express().disable("x-powered-by");
  const server = https.createServer(this.app);
  const port = portServer || 3000;
  const router = express.Router();
  app.use("/", router);

  server.listen(port, async function () {
    logger.info(`App listening on http://localhost:${port}`);
  });
})();