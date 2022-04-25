const jwt = require('jsonwebtoken');

const whiteListurl = [
'/user/v1/user-signin',
'/user/v1/user-signup'
];

/*-----------------*/
const validateJwtToken = async (req, res, next) => {

  if(whiteListurl.includes(req.originalUrl)) return next();
  const token = req.headers['authorization'];
  if(!token) return res.status(403).send({statusText: 'FAIL', statusValue: 403, message: 'UNAUTHORIZED'});

  jwt.verify(token, config.get('authConfig.userKey'), async (err, decoded) => {

    if(err) return res.status(401).send({statusText: 'FAIL', statusValue: 401, message: 'Failed to authenticate'});

    req.headers['decoded'] = JSON.stringify(decoded);
    next();
  });
};

const setupAuth = (app, routes) => {
    routes.forEach(r => {
        if (r.auth) {
            app.use(r.url, validateJwtToken, (req, res, next) => {
                next();
            });
        }
    });
}

exports.setupAuth = setupAuth
