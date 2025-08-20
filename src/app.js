const express = require('express');
const app = express();

const path = require('path')

if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: path.join(__dirname, '/../.env.testing') })
}
else {
  require('dotenv').config({ path: path.join(__dirname, '/../.env') })
}

app.use(express.json());

const authRoutes = require('./routes/auth.route');

app.use('/api/', authRoutes)

app.get('/', (req, res) => {
  res.json({
    message: 'Todo REST API by Express & PostgreSQL',
  });
});

module.exports = app;
