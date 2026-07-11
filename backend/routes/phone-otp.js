const express = require('express')
const router  = express.Router()
const axios   = require('axios')
const auth    = require('../middleware/auth')
const { User } = require('../db')

const phoneOtpStore = {}

// POST /api/phone-otp/send — phone pe OTP bhejo
router.post('/send', auth, async function(req, res) {
  try {
    var phone = req.body.phone || ''
    phone = phone.replace(/\D/g, '')

    if (!phone || phone.length !== 10) {
      return res.status(400).json({ error: 'Valid 10-digit phone number daalo' })
    }

    if (!process.env.MSG91_AUTH_KEY) {
      return res.status(500).json({ error: 'SMS service configured nahi hai' })
    }

    var otp = Math.floor(100000 + Math.random() * 900000).toString()
    phoneOtpStore[phone] = {
      otp: otp,
      userId: req.user.id,
      expiresAt: Date.now() + 5 * 60 * 1000
    }

    // MSG91 API call
    var response = await axios.post(
      'https://control.msg91.com/api/v5/otp',
      {
        template_id: process.env.MSG91_TEMPLATE_ID,
        mobile: '91' + phone,
        authkey: process.env.MSG91_AUTH_KEY,
        otp: otp,
      },
      { headers: { 'Content-Type': 'application/json' } }
    )

    console.log('SMS OTP sent to:', phone, response.data)
    res.json({ success: true, message: 'OTP bheja gaya +91' + phone + ' pe' })
  } catch(err) {
    console.error('SMS OTP error:', err.message)
    res.status(500).json({ error: 'OTP send nahi hua: ' + err.message })
  }
})

// POST /api/phone-otp/verify — OTP verify karo
router.post('/verify', auth, async function(req, res) {
  try {
    var phone = (req.body.phone || '').replace(/\D/g, '')
    var otp   = req.body.otp

    if (!phone || !otp) {
      return res.status(400).json({ error: 'Phone aur OTP required hai' })
    }

    var stored = phoneOtpStore[phone]
    if (!stored) {
      return res.status(400).json({ error: 'OTP nahi mila — pehle send karo' })
    }
    if (Date.now() > stored.expiresAt) {
      delete phoneOtpStore[phone]
      return res.status(400).json({ error: 'OTP expire ho gaya — dobara send karo' })
    }
    if (stored.otp !== otp.toString()) {
      return res.status(400).json({ error: 'Galat OTP — dobara try karo' })
    }
    if (stored.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    delete phoneOtpStore[phone]

    // User ko phone verified mark karo
    var user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    user.isPhoneVerified = true
    user.phone = phone
    await user.save()

    res.json({ success: true, message: 'Phone verified! ✅ Badge mil gaya.' })
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router