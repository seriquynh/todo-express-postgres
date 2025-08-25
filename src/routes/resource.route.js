const express = require('express');

// controllers
const boardController = require('../controllers/board.controller');
const cardController = require('../controllers/card.controller');

// middleware
const authMiddleware = require('../middleware/auth.middleware');
const resourceBindingMiddleware = require('../middleware/resource_binding.middleware')

// forms
const cardForm = require('../forms/card.form');

// routing
const router = express.Router();

router.get('/boards', authMiddleware, boardController.index);
router.post('/boards', [authMiddleware].concat(boardController.storeRules()), boardController.storeAction);
router.get('/boards/:board', [authMiddleware, resourceBindingMiddleware.make('boards', 'board')], boardController.showAction);
router.put('/boards/:board', [authMiddleware, resourceBindingMiddleware.make('boards', 'board')].concat(boardController.updateRules()), boardController.updateAction);
router.patch('/boards/:board', [authMiddleware, resourceBindingMiddleware.make('boards', 'board')].concat(boardController.updateRules()), boardController.updateAction);
router.delete('/boards/:board', [authMiddleware, resourceBindingMiddleware.make('boards', 'board')], boardController.deleteAction);

router.get('/cards', authMiddleware, cardController.indexAction);
router.post('/cards', [authMiddleware].concat(cardForm.storeRules()), cardController.storeAction);

module.exports = router;
