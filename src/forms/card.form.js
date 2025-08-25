const { body } = require('express-validator');

const db = require('../services/db.service')

exports.storeRules = () => {
    return [
        body('name', 'The name field must be required.').not().isEmpty(),
        body('description').custom(async (value) => {
            if (value === undefined || value === null) {
                return;
            }

            if (typeof value !== 'string') {
                throw new Error("The description field must be a string.")
            }
        }),
        body('board_id').custom(async (value, { req }) => {
            let result = await db.query('SELECT * FROM boards WHERE user_id = $1 AND id = $2', [req.user.id, value])

            if (result.rowCount === 0) {
                throw new Error("The board_id field is invalid.");
            }
        }),
    ];
}
