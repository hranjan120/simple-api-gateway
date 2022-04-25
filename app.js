const express = require('express');
const helmet = require('helmet');

const { setupLogging } = require("./proxyUtils/logging");
const { setupRateLimit } = require("./proxyUtils/ratelimit");
const { setupProxies } = require("./proxyUtils/proxy");
const { setupAuth } = require("./proxyUtils/auth");

/*
 *-----------------------Includes Routes----------------
 */
const { ROUTES } = require("./proxyUtils/routes");

/*
 *--------------------Middleware Section-----------------
 */
const app = express();
app.enable('trust proxy');
app.use(helmet());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept, Authorization, Channel, devicetoken');
  if(req.method === 'OPTIONS'){ return res.send(200) }
  next();
});
/*------------------------*/
setupLogging(app);
setupRateLimit(app, ROUTES);
setupAuth(app, ROUTES);
setupProxies(app, ROUTES);


/*----------------------------*/
const port = 5500;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
  console.log(`App is on: ${app.get('env')} Mode`);
});
