const express = require('express')
const router  = express.Router()
const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
const { User } = require('../db')
const auth    = require('../middleware/auth')
const { OAuth2Client } = require('google-auth-library')

const JWT_SECRET   = process.env.JWT_SECRET || 'delhincr_market_secret_2024'
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

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
    res.json({ token, user: { id: user._id, name: user.name, phone: user.phone, email: user.email, avatar: user.avatar, isVerified: user.isVerified, isAdmin: user.isAdmin } })
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/forgot-password', async function(req, res) {
  try {
    var email = (req.body.email || '').trim().toLowerCase()
    if (!email) return res.status(400).json({ error: 'Email required' })

    var user = await User.findOne({ email: { $regex: new RegExp('^' + email + '$', 'i') } })
    if (!user) return res.status(404).json({ error: 'Is email se koi account nahi mila' })

    var otp = Math.floor(100000 + Math.random() * 900000).toString()
    user.resetOtp       = otp
    user.resetOtpExpiry = Date.now() + 5 * 60 * 1000
    await user.save()

    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.error('GMAIL_USER or GMAIL_PASS not set')
      return res.status(500).json({ error: 'Email service configured nahi hai' })
    }

    var nodemailer  = require('nodemailer')
    var transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
      connectionTimeout: 10000,  // 10 second max connect
      greetingTimeout: 10000,
      socketTimeout: 10000,
    })

    // Race against a hard timeout — agar 12 second mein response na aaye, fail mark karo
    var emailPromise = transporter.sendMail({
      from:    '"NukkadMarket" <' + process.env.GMAIL_USER + '>',
      to:      email,
      subject: 'Password Reset OTP - NukkadMarket',
      html: '<div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;"><div style="background: linear-gradient(135deg, #6B21A8, #7C3AED); padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 20px;"><h1 style="color: white; margin: 0;">NukkadMarket</h1></div><h2>Password Reset</h2><p style="color: #6B7280;">Aapka password reset OTP:</p><div style="background: #F5F3FF; border: 2px solid #6B21A8; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;"><span style="font-size: 36px; font-weight: 800; color: #6B21A8; letter-spacing: 8px;">' + otp + '</span></div><p style="color: #6B7280; font-size: 14px;">5 minutes mein expire ho jaayega</p></div>'
    })

    var timeoutPromise = new Promise(function(resolve, reject) {
      setTimeout(function() { reject(new Error('Email send timeout - 12 seconds')) }, 12000)
    })

    await Promise.race([emailPromise, timeoutPromise])

    console.log('OTP email sent successfully to:', email)
    res.json({ success: true, message: 'OTP bheja gaya ' + email + ' pe' })
  } catch(err) {
    console.error('Forgot password error:', err.message)
    res.status(500).json({ error: 'OTP send nahi hua: ' + err.message })
  }
})

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
      return res.status(400).json({ error: 'OTP expire ho gaya - dobara send karo' })
    }
    if (user.resetOtp !== otp.toString()) {
      return res.status(400).json({ error: 'Galat OTP' })
    }

    user.passwordHash   = await bcrypt.hash(newPassword, 10)
    user.resetOtp       = undefined
    user.resetOtpExpiry = undefined
    await user.save()

    res.json({ success: true, message: 'Password successfully change ho gaya!' })
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/me', auth, async function(req, res) {
  try {
    var user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ id: user._id, name: user.name, phone: user.phone, email: user.email, avatar: user.avatar, isVerified: user.isVerified, isAdmin: user.isAdmin })
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

router.patch('/profile', auth, async function(req, res) {
  try {
    var { name, email, city, location, avatar, phone } = req.body
    var user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    if (phone && phone !== user.phone) {
      if (!/^[6-9]\d{9}$/.test(phone)) {
        return res.status(400).json({ error: 'Valid 10-digit phone number daalo' })
      }
      var existing = await User.findOne({ phone: phone })
      if (existing) return res.status(409).json({ error: 'Yeh phone number already registered hai' })
      user.phone = phone
    }


    if (name)     user.name     = name
    if (email)    user.email    = email
    if (city)     user.city     = city
    if (location) user.location = location
    if (avatar)   user.avatar   = avatar
    await user.save()
    var token = jwt.sign({ id: user._id, name: user.name, phone: user.phone }, JWT_SECRET, { expiresIn: '7d' })
    res.json({
      token,
      user: {
        id: user._id, name: user.name, phone: user.phone, email: user.email,
        avatar: user.avatar, city: user.city, location: user.location,
        isVerified: user.isVerified, isAdmin: user.isAdmin,
      }
    })
  } catch(err) { res.status(500).json({ error: err.message }) }
})

router.post('/google', async function(req, res) {
  try {
    var credential = req.body.credential
    if (!credential) return res.status(400).json({ error: 'Google credential required' })

    var ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    var payload  = ticket.getPayload()
    var email    = payload.email
    var name     = payload.name
    var avatar   = payload.picture
    var googleId = payload.sub

    var user = await User.findOne({ email: email })
    if (!user) {
      var fakeHash = await bcrypt.hash(googleId + 'nukkad', 10)
      user = await User.create({
        name, email, phone: 'g_' + googleId.slice(0, 10),
        passwordHash: fakeHash, isVerified: true, avatar,
      })
    } else if (!user.avatar) {
      user.avatar = avatar
      await user.save()
    }

    var token = jwt.sign({ id: user._id, name: user.name, phone: user.phone }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, name: user.name, phone: user.phone, email: user.email, avatar: user.avatar, isVerified: user.isVerified, isAdmin: user.isAdmin } })
  } catch(err) {
    res.status(500).json({ error: 'Google login failed: ' + err.message })
  }
})

module.exports = router