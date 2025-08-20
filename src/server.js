const app = require('./app');

const path = require('path')

if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: path.join(__dirname, '/../.env.testing') })
}
else {
  require('dotenv').config({ path: path.join(__dirname, '/../.env') })
}

const port = process.env.APP_PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
