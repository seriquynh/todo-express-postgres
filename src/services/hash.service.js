import * as bcrypt from 'bcrypt'

const saltRounds = 12;

export const hash = async (value) => {
    const hashed = await bcrypt.hash(value, saltRounds);

    return hashed;
}

export const check = async (value, hashed) => {
    const isMatch = await bcrypt.compare(value, hashed);

    return isMatch;
}
