var jwt = require('jsonwebtoken');

// Instead of setting up a database to store sessions, we mock it with a global variable
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token === null) return res.sendStatus(401); // Unauthorized (not given credentials)

  jwt.verify(token, process.env.BEARER_TOKEN_SECRET, (err, payload) => {
    if (err) return res.sendStatus(403); // Unauthenticated (no access)

    req.email=payload.email;
    next();
  })
}

module.exports = {
  SESSION_STORE: {},
  authenticateToken,
}