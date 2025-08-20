const express = require('express');
const auth = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', auth.registerRules(), auth.register);
router.post('/login', auth.loginRules(), auth.register);
router.get('/me', authMiddleware, auth.me);

module.exports = router;
