const express = require('express');

// controllers
const authController = require('../controllers/auth.controller');

// middleware
const authMiddleware = require('../middleware/auth.middleware');

// routing
const router = express.Router();

router.post('/register', authController.registerRules(), authController.register);
router.post('/login', authController.loginRules(), authController.login);
router.get('/me', authMiddleware, authController.me);

module.exports = router;
