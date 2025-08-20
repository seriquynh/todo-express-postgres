const db = require('../services/db.service');
const hash = require('../services/hash.service');
const { transformValidationErrors } = require('../utils/validation.util');

const { validationResult } = require('express-validator');
const { body } = require('express-validator');

exports.registerRules = () => {
    return [
        body('name', 'The name field must be required.').not().isEmpty(),
        body('email', 'The email field must be required.').not().isEmpty(),
        body('email', 'The email field must be a valid email address.').isEmail(),
        body('email').custom(async value => {
            const result = await db.query(`SELECT * FROM users WHERE email = $1`, [value])

            if (result.rowCount > 0) {
                throw new Error('The given E-mail address already exists.');
            }
        }),
        body('password', 'The password field must be required.').not().isEmpty(),
    ];
};

exports.register = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json(
            transformValidationErrors(errors)
        );
    }
    const { name, email, password } = req.body;
    const hashed = await hash.hash(password);
    await db.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`, [name, email, hashed]);
    res.status(201).json({
        data: { name, email }
    })
};
