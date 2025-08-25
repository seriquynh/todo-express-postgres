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

app.get('/up', (req, res) => {
  res.json({
    message: 'Todo REST API by Express & PostgreSQL',
  });
});

app.use('/api/', require('./routes/auth.route'))
app.use('/api/', require('./routes/resource.route'))

module.exports = app;
