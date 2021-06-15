var jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next) {
  var token = req.headers['x-api-token'];
  if (!token){
    return res.status(403).send({ auth: false, message: 'Token not provided.' });
  }
  jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
    if (err)
    return res.status(500).send({ auth: false, message: 'Invalid token, try again.' });
    // if everything good, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });
}
module.exports = verifyToken;