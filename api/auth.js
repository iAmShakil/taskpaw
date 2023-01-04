const jwt = require('jsonwebtoken')

const secret = process.env.JWT_SECRET

const signJwt = (data) => {
  return jwt.sign(data, secret)
}

const getJwtVerifiedData = (token) => {
  return jwt.verify(token, secret)
}

module.exports = {
  signJwt,
  getJwtVerifiedData
}
