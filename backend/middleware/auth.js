const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'delhincr_market_secret_2024'

module.exports = function(req, res, next) {
  try {
    const authHeader = req.headers['authorization']
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied — token required' })
    }
    const token = authHeader.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'No token provided' })

    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded

    // Token expiry check
    const now = Math.floor(Date.now() / 1000)
    if (decoded.exp && decoded.exp < now) {
      return res.status(401).json({ error: 'Token expired — please login again' })
    }

    next()
  } catch(err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Invalid token' })
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired — please login again' })
    }
    return res.status(500).json({ error: 'Auth error' })
  }
}