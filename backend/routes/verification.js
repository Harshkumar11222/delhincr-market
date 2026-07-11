const express  = require('express')
const router   = express.Router()
const auth     = require('../middleware/auth')
const adminAuth = require('../middleware/admin')
const { User } = require('../db')
const mongoose = require('mongoose')

// POST /api/verification/submit — ID documents upload karo
router.post('/submit', auth, async function(req, res) {
  try {
    var { idType, idNumber, idImageUrl } = req.body

    if (!idType || !idNumber || !idImageUrl) {
      return res.status(400).json({ error: 'ID type, number aur image zaroori hai' })
    }

    var validIdTypes = ['aadhaar', 'pan', 'driving_license', 'voter_id', 'passport']
    if (!validIdTypes.includes(idType)) {
      return res.status(400).json({ error: 'Valid ID type select karo' })
    }

    var user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ error: 'User not found' })

    if (user.idVerification && user.idVerification.status === 'approved') {
      return res.status(400).json({ error: 'Already verified hai!' })
    }

    user.idVerification = {
      idType,
      idNumber: idNumber.trim().toUpperCase(),
      idImageUrl,
      status: 'pending',
      submittedAt: new Date(),
    }
    await user.save()

    res.json({ success: true, message: 'Documents submit ho gaye! Admin 24-48 ghante mein verify karega.' })
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/verification/status — apna verification status dekho
router.get('/status', auth, async function(req, res) {
  try {
    var user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({
      isPhoneVerified: user.isPhoneVerified || false,
      isVerified:      user.isVerified || false,
      idVerification:  user.idVerification || null,
    })
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/verification/approve/:userId — Admin: approve/reject karo
router.patch('/approve/:userId', adminAuth, async function(req, res) {
  try {
    var { action, reason } = req.body
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Action must be approve or reject' })
    }

    var user = await User.findById(req.params.userId)
    if (!user) return res.status(404).json({ error: 'User not found' })
    if (!user.idVerification) return res.status(400).json({ error: 'No verification request found' })

    if (action === 'approve') {
      user.idVerification.status = 'approved'
      user.idVerification.approvedAt = new Date()
      user.isVerified = true  // Main verified badge ON
    } else {
      user.idVerification.status = 'rejected'
      user.idVerification.rejectedAt = new Date()
      user.idVerification.rejectionReason = reason || 'Documents valid nahi hain'
      user.isVerified = false
    }

    await user.save()
    res.json({ success: true, message: 'Verification ' + action + 'd successfully' })
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/verification/pending — Admin: pending verifications dekho
router.get('/pending', adminAuth, async function(req, res) {
  try {
    var users = await User.find({ 'idVerification.status': 'pending' })
      .select('name phone email avatar idVerification createdAt')
      .sort({ 'idVerification.submittedAt': 1 })
    res.json({ users, total: users.length })
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router