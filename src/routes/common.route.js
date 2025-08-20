const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Todo REST API by Express & PostgreSQL',
  });
});

module.exports = router;
