const jwt = require('jsonwebtoken')

exports.generateAccessToken = async (user) => {
  return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

exports.verifyAccessToken = async (token) => {
  return await jwt.verify(token, process.env.TOKEN_SECRET);
}
