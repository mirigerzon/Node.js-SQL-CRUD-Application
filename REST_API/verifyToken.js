const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

function verifyToken(req, res, next) {
  const openPaths = ['/login', '/register'];
  if (openPaths.includes(req.path)) {
    return next();
  }
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    if (decoded.ip !== req.ip) {
      return res.status(403).json({ error: 'Token IP mismatch' });
    }
    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;
