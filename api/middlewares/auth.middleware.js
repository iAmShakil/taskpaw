const { getJwtVerifiedData } = require('../auth')

const authMiddleware = (req, _, next) => {
  try {
    const token = req.cookies['auth._token.google'].split('Bearer ')[1]
    const data = getJwtVerifiedData(token)
    req.user = {
      email: data.email,
      id: data.id
    }
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = authMiddleware
