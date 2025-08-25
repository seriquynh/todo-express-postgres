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

app.use('/', require('./routes/common.route'))
app.use('/api/', require('./routes/auth.route'))
app.use('/api/', require('./routes/board.route'))
app.use('/api/', require('./routes/api.route'))

module.exports = app;
