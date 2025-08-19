const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Todo REST API by Express & PostgreSQL');
});

module.exports = app;
