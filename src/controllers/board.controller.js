const db = require('../services/db.service')
const { transformValidationErrors } = require('../utils/validation.util');

const { validationResult } = require('express-validator');
const { body } = require('express-validator');

exports.index = async (req, res) => {
    const result = await db.query('SELECT * FROM boards WHERE user_id = $1', [req.user.id]);
    const data = result.rows.map(row => {
        return {
            id: row.id,
            name: row.name,
        }
    })
    res.json({
        data,
    });
}

exports.storeRules = () => {
    return [
        body('name', 'The name field must be required.').not().isEmpty(),
    ];
}

exports.storeAction = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json(
            transformValidationErrors(errors)
        );
    }

    const { name } = req.body;

    await db.query('INSERT INTO boards (name, user_id) VALUES ($1, $2)', [name, req.user.id]);

    const result = await db.query('SELECT * FROM boards WHERE user_id = $1 AND name = $2 ORDER BY id DESC LIMIT 1', [req.user.id, name])

    res.status(201).json({
        data: {
            id: result.rows[0].id,
            name: result.rows[0].name,
            user_id: result.rows[0].user_id,
        },
    })
}

exports.showAction = async (req, res) => {
    res.json({
        data: {
            id: req.board.id,
            name: req.board.name,
            user_id: req.board.user_id,
        },
    })
}

exports.updateRules = () => {
    return [
        body('name', 'The name field must be required.').not().isEmpty(),
    ]
}

exports.updateAction = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json(
            transformValidationErrors(errors)
        );
    }

    const { name } = req.body;

    if (name !== req.board.name) {
        await db.query('UPDATE boards SET name = $1 WHERE id = $2 AND user_id = $3', [name, req.board.id, req.user.id]);
    }

    res.json({
        data: {
            id: req.board.id,
            name,
            user_id: req.board.user_id,
        }
    })
}

exports.deleteAction = async (req, res) => {
    await db.query('DELETE FROM boards WHERE id = $1 AND user_id = $2', [req.board.id, req.user.id]);

    res.json({
        message: `Project ${req.board.id} was deleted.`,
    })
}
