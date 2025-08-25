const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const cardController = require('../controllers/card.controller');
const cardForm = require('../forms/card.form');

const router = express.Router();

router.get('/cards', authMiddleware, cardController.indexAction);
router.post('/cards', [authMiddleware].concat(cardForm.storeRules()), cardController.storeAction);

module.exports = router;
