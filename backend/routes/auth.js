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

// POST /api/auth/forgot-password — email pe OTP bhejo
router.post('/forgot-password', async function(req, res) {
  try {
    var email = req.body.email
    if (!email) return res.status(400).json({ error: 'Email required' })

    var user = await User.findOne({ email: email })
    if (!user) return res.status(404).json({ error: 'Is email se koi account nahi mila' })

    // 6 digit OTP generate karo
    var otp = Math.floor(100000 + Math.random() * 900000).toString()

    // OTP store karo user mein (5 min)
    user.resetOtp       = otp
    user.resetOtpExpiry = Date.now() + 5 * 60 * 1000
    await user.save()

    // Email bhejo
    var nodemailer   = require('nodemailer')
    var transporter  = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      }
    })

    await transporter.sendMail({
      from:    '"DelhiNCR Market" <' + process.env.GMAIL_USER + '>',
      to:      email,
      subject: 'Password Reset OTP — DelhiNCR Market',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1E3A8A, #2563EB); padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0;">DelhiNCR Market</h1>
          </div>
          <h2>Password Reset</h2>
          <p style="color: #6B7280;">Aapka password reset OTP:</p>
          <div style="background: #FFF0EB; border: 2px solid #FF6B35; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 36px; font-weight: 800; color: #FF6B35; letter-spacing: 8px;">${otp}</span>
          </div>
          <p style="color: #6B7280; font-size: 14px;">⏱️ 5 minutes mein expire ho jaayega</p>
          <p style="color: #6B7280; font-size: 14px;">🔒 Kisi ke saath share mat karo</p>
        </div>
      `
    })

    res.json({ success: true, message: 'OTP bheja gaya ' + email + ' pe' })
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/auth/reset-password — naya password set karo
router.post('/reset-password', async function(req, res) {
  try {
    var email       = req.body.email
    var otp         = req.body.otp
    var newPassword = req.body.newPassword

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP aur naya password required hai' })
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password minimum 6 characters ka hona chahiye' })
    }

    var user = await User.findOne({ email: email })
    if (!user) return res.status(404).json({ error: 'User nahi mila' })
    if (!user.resetOtp) return res.status(400).json({ error: 'Pehle OTP send karo' })
    if (Date.now() > user.resetOtpExpiry) {
      return res.status(400).json({ error: 'OTP expire ho gaya — dobara send karo' })
    }
    if (user.resetOtp !== otp.toString()) {
      return res.status(400).json({ error: 'Galat OTP' })
    }

    // Password update karo
    var bcrypt       = require('bcryptjs')
    user.passwordHash    = await bcrypt.hash(newPassword, 10)
    user.resetOtp        = undefined
    user.resetOtpExpiry  = undefined
    await user.save()

    res.json({ success: true, message: 'Password successfully change ho gaya!' })
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