require('dotenv').config()

const jwt = require('jsonwebtoken')

exports.createToken = (entity) => {
    return jwt.sign(entity, process.env.SECRET, {
        expiresIn: "1 day"
    })
}

exports.verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.SECRET)
    } catch (error) {
        return Promise.reject({message: 'Invalid token'})
    }
}