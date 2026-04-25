const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const db = require('../db')

const JWT_SECRET = process.env.JWT_SECRET || 'delhincr_market_secret_2024'

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body
    if (!name || !phone || !password) {
      return res.status(400).json({ error: 'Name, phone and password are required' })
    }
    const existingUser = db.get('users').find({ phone }).value()
    if (existingUser) {
      return res.status(409).json({ error: 'Phone number already registered' })
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const user = {
      id: uuidv4(),
      name,
      email: email || '',
      phone,
      passwordHash,
      isVerified: false,
      avatar: `https://i.pravatar.cc/150?u=${phone}`,
      location: '',
      area: '',
      city: '',
      createdAt: new Date().toISOString(),
    }
    db.get('users').push(user).write()
    const token = jwt.sign({ id: user.id, name: user.name, phone: user.phone }, JWT_SECRET, { expiresIn: '7d' })
    const { passwordHash: _, ...userSafe } = user
    res.status(201).json({ token, user: userSafe })
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body
    if (!phone || !password) {
      return res.status(400).json({ error: 'Phone and password are required' })
    }
    const user = db.get('users').find({ phone }).value()
    if (!user) return res.status(401).json({ error: 'Invalid phone number or password' })

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return res.status(401).json({ error: 'Invalid phone number or password' })

    const token = jwt.sign({ id: user.id, name: user.name, phone: user.phone }, JWT_SECRET, { expiresIn: '7d' })
    const { passwordHash: _, ...userSafe } = user
    res.json({ token, user: userSafe })
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message })
  }
})

// GET /api/auth/me
router.get('/me', require('../middleware/auth'), (req, res) => {
  const user = db.get('users').find({ id: req.user.id }).value()
  if (!user) return res.status(404).json({ error: 'User not found' })
  const { passwordHash: _, ...userSafe } = user
  res.json(userSafe)
})

module.exports = router