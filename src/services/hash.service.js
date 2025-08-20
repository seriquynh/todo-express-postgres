const bcrypt = require('bcrypt');

const saltRounds = 12;

exports.hash = async (value) => {
    const hashed = await bcrypt.hash(value, saltRounds);

    return hashed;
}

exports.check = async (value, hashed) => {
    const isMatch = await bcrypt.compare(value, hashed);

    return isMatch;
}
