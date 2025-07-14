// authMiddleware.js

// const authMiddleware = (req, res, next) => {
//     // Example: Check if user is authenticated
//     if (!req.session.userid) { // Example using sessions
//       return res.status(401).json({ error: 'Unauthorized' });
//     }
//     next();
//   };
  
//   module.exports = authMiddleware;
  

// const generateAccessToken = (user) => {
//   return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
// };

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (token == null) {
//     return res.sendStatus(401); // No token found
//   }

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//     if (err) {
//       return res.sendStatus(403); // Invalid token
//     }

//     req.user = user;
//     next();
//   });
// };
const jwt = require('jsonwebtoken');
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401); // No token found
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Invalid token
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;