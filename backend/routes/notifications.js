const express = require('express')
const router  = express.Router()
const { Notification } = require('../db')
const auth    = require('../middleware/auth')

router.get('/my', auth, async function(req, res) {
  try {
    var notifs = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(20)
    var unread = notifs.filter(function(n) { return !n.read }).length
    res.json({ notifications: notifs, unread })
  } catch(err) {
    res.json({ notifications: [], unread: 0 })
  }
})

router.patch('/read-all', auth, async function(req, res) {
  try {
    await Notification.updateMany({ userId: req.user.id }, { read: true })
    res.json({ success: true })
  } catch(err) {
    res.json({ success: false })
  }
})

router.createNotification = async function(userId, title, message, type) {
  try {
    await Notification.create({ userId, title, message, type: type || 'info' })
  } catch(err) {}
}

module.exports = router