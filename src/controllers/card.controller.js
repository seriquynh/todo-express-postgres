const { validationResult } = require('express-validator');

const db = require('../services/db.service')
const { transformValidationErrors } = require('../utils/validation.util');

exports.indexAction = async (req, res) => {
    const result = await db.query(`
        SELECT cards.*
        FROM cards INNER JOIN boards ON cards.board_id = boards.id
        WHERE boards.user_id = $1
    `, [req.user.id]);

    const data = result.rows.map(row => {
        return {
            id: row.id,
            name: row.name,
            description: row.description,
            archived: row.archived,
            board_id: row.board_id
        }
    })

    res.json({ data });
}

exports.storeAction = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json(
            transformValidationErrors(errors)
        );
    }

    const { name, description, board_id } = req.body;

    await db.query(`
        INSERT INTO cards (name, description, board_id)
        VALUES ($1, $2, $3)
    `, [name, description, board_id]);

    const result = await db.query(`
        SELECT * FROM cards
        WHERE board_id = $1
        ORDER BY id DESC
        LIMIT 1
    `, [board_id]);

    res.status(201).json({
        data: {
            id: result.rows[0].id,
            name: result.rows[0].name,
            description: result.rows[0].description,
            archived: result.rows[0].archived,
            board_id: result.rows[0].board_id,
        },
    })
}
