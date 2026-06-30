const express  = require('express')
const router   = express.Router()
const SibApiV3Sdk = require('@getbrevo/brevo')
const { User } = require('../db')

const otpStore = {}

var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY)

function otpEmailHTML(otp) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #6B21A8, #7C3AED); padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
        <h1 style="color: white; font-size: 24px; margin: 0;">🏪 NukkadMarket</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0;">Apna Nukkad, Apna Bazaar</p>
      </div>
      <h2 style="color: #111827;">Email Verification</h2>
      <p style="color: #6B7280;">Your OTP for registration is:</p>
      <div style="background: #F5F3FF; border: 2px solid #6B21A8; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
        <span style="font-size: 36px; font-weight: 800; color: #6B21A8; letter-spacing: 8px;">${otp}</span>
      </div>
      <p style="color: #6B7280; font-size: 14px;">⏱️ Valid for <strong>5 minutes</strong> only.</p>
      <p style="color: #6B7280; font-size: 14px;">🔒 Kisi ke saath share mat karo.</p>
    </div>
  `
}

router.post('/send', async function(req, res) {
  try {
    var email = req.body.email
    if (!email) return res.status(400).json({ error: 'Email required' })

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    if (!process.env.BREVO_API_KEY) {
      console.error('BREVO_API_KEY not set')
      return res.status(500).json({ error: 'Email service configured nahi hai' })
    }

    var otp = Math.floor(100000 + Math.random() * 900000).toString()
    otpStore[email] = {
      otp: otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    }

    var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()
    sendSmtpEmail.subject = 'Your OTP - NukkadMarket'
    sendSmtpEmail.htmlContent = otpEmailHTML(otp)
    sendSmtpEmail.sender = { name: 'NukkadMarket', email: process.env.BREVO_SENDER_EMAIL || 'harshkuma884@gmail.com' }
    sendSmtpEmail.to = [{ email: email }]

    await apiInstance.sendTransacEmail(sendSmtpEmail)

    console.log('Registration OTP sent to:', email)
    res.json({ success: true, message: 'OTP sent to ' + email })
  } catch(err) {
    console.error('OTP send error:', err.message)
    delete otpStore[req.body.email]
    res.status(500).json({ error: 'Email send failed: ' + err.message })
  }
})

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
  delete otpStore[email]
  res.json({ success: true, message: 'Email verified!' })
})

module.exports = router