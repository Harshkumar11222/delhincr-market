const express    = require('express')
const router     = express.Router()
const nodemailer = require('nodemailer')
const { User }   = require('../db')

// OTP store — memory mein (5 min valid)
const otpStore = {}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  }
})

// POST /api/otp/send — email pe OTP bhejo
router.post('/send', async function(req, res) {
  try {
    var email = req.body.email
    if (!email) return res.status(400).json({ error: 'Email required' })

    // Check valid email format
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    // Generate 6 digit OTP
    var otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Store with 5 min expiry
    otpStore[email] = {
      otp: otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    }

    // Send email
    await transporter.sendMail({
      from: '"DelhiNCR Market" <' + process.env.GMAIL_USER + '>',
      to: email,
      subject: 'Your OTP — DelhiNCR Market',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1E3A8A, #2563EB); padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; font-size: 24px; margin: 0;">DelhiNCR Market</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0;">Apna Shehar, Apna Bazaar</p>
          </div>
          <h2 style="color: #111827;">Email Verification</h2>
          <p style="color: #6B7280;">Your OTP for registration is:</p>
          <div style="background: #FFF0EB; border: 2px solid #FF6B35; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 36px; font-weight: 800; color: #FF6B35; letter-spacing: 8px;">${otp}</span>
          </div>
          <p style="color: #6B7280; font-size: 14px;">⏱️ Valid for <strong>5 minutes</strong> only.</p>
          <p style="color: #6B7280; font-size: 14px;">🔒 Kisi ke saath share mat karo.</p>
          <hr style="border: 1px solid #F3F4F6; margin: 20px 0;">
          <p style="color: #9CA3AF; font-size: 12px;">If you didn't request this, ignore this email.</p>
        </div>
      `
    })

    res.json({ success: true, message: 'OTP sent to ' + email })
  } catch(err) {
    res.status(500).json({ error: 'Email send failed: ' + err.message })
  }
})

// POST /api/otp/verify — OTP verify karo
router.post('/verify', function(req, res) {
  var email = req.body.email
  var otp   = req.body.otp

  if (!email || !otp) return res.status(400).json({ error: 'Email and OTP required' })

  var stored = otpStore[email]
  if (!stored) return res.status(400).json({ error: 'OTP nahi mila — pehle send karo' })
  if (Date.now() > stored.expiresAt) {
    delete otpStore[email]
    return res.status(400).json({ error: 'OTP expire ho gaya — dobara send karo' })
  }
  if (stored.otp !== otp.toString()) {
    return res.status(400).json({ error: 'Galat OTP hai' })
  }

  // OTP correct — delete karo
  delete otpStore[email]
  res.json({ success: true, message: 'Email verified!' })
})

module.exports = router