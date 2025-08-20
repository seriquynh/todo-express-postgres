const db = require('../services/db.service');
const hash = require('../services/hash.service');
const security = require('../services/security.service');
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

exports.loginRules = () => {
    return [
        body('email', 'The email field must be required.').not().isEmpty(),
        body('email', 'The email field must be a valid email address.').isEmail(),
        body('email').custom(async value => {
            const result = await db.query(`SELECT * FROM users WHERE email = $1`, [value])

            if (result.rowCount == 0) {
                throw new Error('The given E-mail does not exist.');
            }
        }),
        body('password', 'The password field must be required.').not().isEmpty(),
    ];
}

exports.login = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json(
            transformValidationErrors(errors)
        );
    }

    const { email, password } = req.body;
    const result = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);

    const user = result.rows[0];

    if (!(await hash.check(password, user.password))) {
        return res.status(401).json({
            message: 'Invalid credentials.'
        });
    }

    const token = await security.generateAccessToken({ id: user.id });

    res.json({
        data: { access_token: token }
    });
}

exports.me = async (req, res) => {
  const result = await db.query('SELECT * FROM users WHERE id = $1', [req.user.id])

  const me = {
    id: result.rows[0].id,
    email: result.rows[0].email,
  };

  res.json({
    data: me,
  });
}
