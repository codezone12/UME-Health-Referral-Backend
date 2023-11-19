const JWT = require('jsonwebtoken')
const { errorResponse } = require('../config/responceHandler')

const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = JWT.verify(token, process.env.JWT_SECRET)
    req.userData = decoded.User
    next()
  } catch (error) {
    return errorResponse(res, 'Authentication Failed!', [] ,401)
  }
  // User = 0
  // Approver = 1
  // Admin = 2
}

module.exports = checkAuth
