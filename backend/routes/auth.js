const express = require('express')
const router  = express.Router()
const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
const { User } = require('../db')
const auth    = require('../middleware/auth')
const { OAuth2Client } = require('google-auth-library')
const SibApiV3Sdk = require('@getbrevo/brevo')


const JWT_SECRET   = process.env.JWT_SECRET || 'delhincr_market_secret_2024'
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

function otpEmailHTML(otp) {
  return '<div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;"><div style="background: linear-gradient(135deg, #6B21A8, #7C3AED); padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 20px;"><h1 style="color: white; margin: 0;">NukkadMarket</h1></div><h2>Password Reset</h2><p style="color: #6B7280;">Aapka password reset OTP:</p><div style="background: #F5F3FF; border: 2px solid #6B21A8; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;"><span style="font-size: 36px; font-weight: 800; color: #6B21A8; letter-spacing: 8px;">' + otp + '</span></div><p style="color: #6B7280; font-size: 14px;">5 minutes mein expire ho jaayega</p><p style="color: #6B7280; font-size: 14px;">Kisi ke saath share mat karo</p></div>'
}

async function sendEmail(toEmail, subject, html) {
  var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()
  sendSmtpEmail.subject = subject
  sendSmtpEmail.htmlContent = html
  sendSmtpEmail.sender = { name: 'NukkadMarket', email: process.env.BREVO_SENDER_EMAIL || 'harshkuma884@gmail.com' }
  sendSmtpEmail.to = [{ email: toEmail }]
  return apiInstance.sendTransacEmail(sendSmtpEmail)
}

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

    if (!process.env.BREVO_API_KEY) {
      console.error('BREVO_API_KEY not set')
      return res.status(500).json({ error: 'Email service configured nahi hai' })
    }


    try {
      await sendEmail(email, 'Password Reset OTP - NukkadMarket', otpEmailHTML(otp))
      console.log('OTP email sent successfully to:', email)
      res.json({ success: true, message: 'OTP bheja gaya ' + email + ' pe' })
    } catch(emailErr) {
      console.error('Brevo send error:', emailErr.message)
      return res.status(500).json({ error: 'OTP send nahi hua: ' + emailErr.message })
    }
  } catch(err) {
    console.error('Forgot password error:', err.message)
    res.status(500).json({ error: 'OTP send nahi hua: ' + err.message })
  }
})

router.post('/reset-password', async function(req, res) {
  try {
    var email       = (req.body.email || '').trim().toLowerCase()
    var otp         = req.body.otp
    var newPassword = req.body.newPassword

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP aur naya password required hai' })
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password minimum 6 characters ka hona chahiye' })
    }

    var user = await User.findOne({ email: { $regex: new RegExp('^' + email + '$', 'i') } })
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

    if (phone && phone.trim() !== user.phone && phone.trim() !== '') {
      var cleanPhone = phone.trim()
      if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
        return res.status(400).json({ error: 'Valid 10-digit phone number daalo (sirf number, jaise 9876543210)' })
      }
      var existingPhone = await User.findOne({ phone: cleanPhone })
      if (existingPhone && existingPhone._id.toString() !== user._id.toString()) {
        return res.status(409).json({ error: 'Yeh phone number already registered hai' })
      }
      user.phone = cleanPhone
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

    var user = await User.findOne({ email: { $regex: new RegExp('^' + email + '$', 'i') } })
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