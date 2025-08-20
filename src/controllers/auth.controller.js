const db = require('../services/db.service');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    await db.query(`
        INSERT INTO users (name, email, password) VALUES ($1, $2, $3)
    `, [name, email, password]);
    res.json({
        message: 'User registered successfully',
    })
};
