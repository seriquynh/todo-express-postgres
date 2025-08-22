const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const { factory } = require('../middleware/resource.middleware');
const board = require('../controllers/board.controller');

const router = express.Router();

router.get('/boards', authMiddleware, board.index);
router.post('/boards', [authMiddleware].concat(board.storeRules()), board.storeAction);
router.get('/boards/:board', [authMiddleware, factory('boards', 'board')], board.showAction);
router.put('/boards/:board', [authMiddleware, factory('boards', 'board')].concat(board.updateRules()), board.updateAction);
router.patch('/boards/:board', [authMiddleware, factory('boards', 'board')].concat(board.updateRules()), board.updateAction);
router.delete('/boards/:board', [authMiddleware, factory('boards', 'board')], board.deleteAction);

module.exports = router;
