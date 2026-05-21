const jwt = require('jsonwebtoken')
const { User } = require('../db')
const JWT_SECRET = process.env.JWT_SECRET || 'delhincr_market_secret_2024'

module.exports = async function(req, res, next) {
  try {
    const authHeader = req.headers['authorization']
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token required' })
    }
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(decoded.id)
    if (!user) return res.status(401).json({ error: 'User not found' })
    if (!user.isAdmin) return res.status(403).json({ error: 'Admin access required' })
    if (user.isBanned) return res.status(403).json({ error: 'Account banned' })
    req.user = decoded
    req.adminUser = user
    next()
  } catch(err) {
    return res.status(403).json({ error: 'Invalid token' })
  }
}