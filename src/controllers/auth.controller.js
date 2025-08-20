const db = require('../services/db.service');
const hash = require('../services/hash.service');

exports.register = async (req, res) => {
    // TODO: Validate request body.
    const { name, email, password } = req.body;
    const hashed = await hash.hash(password);
    await db.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`, [name, email, hashed]);
    res.json({
        name, email,
    })
};
