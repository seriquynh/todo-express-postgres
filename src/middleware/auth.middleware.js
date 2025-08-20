const db = require('../services/db.service');
const security = require('../services/security.service');

module.exports = async (req, res, next) => {
  let token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  token = token.split(' ')[1]; // Remove 'Bearer' prefix

  try {
    const encoded = await security.verifyAccessToken(token);

    const result = await db.query('SELECT * FROM users WHERE id = $1', [encoded.id]);

    if (result.rowCount === 0) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.user = {
        id: result.rows[0].id,
    }; // Attach user data to request object

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
}
