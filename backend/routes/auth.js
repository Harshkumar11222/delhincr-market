const express = require('express')
const router  = express.Router()
const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
const { User } = require('../db')

const JWT_SECRET = process.env.JWT_SECRET || 'delhincr_market_secret_2024'

router.post('/register', async function(req, res) {
  try {
    var { name, email, phone, password } = req.body
    if (!name || !phone || !password) {
      return res.status(400).json({ error: 'Name, phone and password required' })
    }
    var existing = await User.findOne({ phone: phone })
    if (existing) return res.status(409).json({ error: 'Phone already registered' })

    var passwordHash = await bcrypt.hash(password, 10)
    var user = await User.create({
      name, email: email || '', phone, passwordHash,
      avatar: 'https://i.pravatar.cc/150?u=' + phone,
    })
    var token = jwt.sign({ id: user._id, name: user.name, phone: user.phone }, JWT_SECRET, { expiresIn: '7d' })
    res.status(201).json({ token, user: { id: user._id, name: user.name, phone: user.phone, email: user.email, avatar: user.avatar, isVerified: user.isVerified } })
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/login', async function(req, res) {
  try {
    var { phone, password } = req.body
    if (!phone || !password) return res.status(400).json({ error: 'Phone and password required' })
    var user = await User.findOne({ phone: phone })
    if (!user) return res.status(401).json({ error: 'Invalid phone or password' })
    var valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return res.status(401).json({ error: 'Invalid phone or password' })
    var token = jwt.sign({ id: user._id, name: user.name, phone: user.phone }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, name: user.name, phone: user.phone, email: user.email, avatar: user.avatar, isVerified: user.isVerified } })
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/me', require('../middleware/auth'), async function(req, res) {
  try {
    var user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ id: user._id, name: user.name, phone: user.phone, email: user.email, avatar: user.avatar, isVerified: user.isVerified })
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router