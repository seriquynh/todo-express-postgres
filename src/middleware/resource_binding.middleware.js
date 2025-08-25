const db = require('../services/db.service');

exports.make = (table, paramName = 'id') => {
    return async (req, res, next) => {
        const id = parseInt(req.params[paramName])

        const result = await db.query(`SELECT * FROM ${table} WHERE id = $1 AND user_id = $2 LIMIT 1`, [id, req.user.id])

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: 'Resource not found',
            })
        }

        req[paramName] = result.rows[0]

        next();
    }
}
