const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const board = require('../controllers/board.controller');

const router = express.Router();

router.use(authMiddleware);

router.get('/boards', board.index);

module.exports = router;
