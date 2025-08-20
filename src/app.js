const express = require('express');
const app = express();

app.use(express.json());

const authRoutes = require('./routes/auth.route');

app.use('/api/', authRoutes)

app.get('/', (req, res) => {
  res.send('Todo REST API by Express & PostgreSQL');
});

module.exports = app;
