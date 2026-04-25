const express = require('express')
const router  = express.Router()
const { v4: uuidv4 } = require('uuid')
const db      = require('../db')
const auth    = require('../middleware/auth')

// GET /api/notifications/my
router.get('/my', auth, function(req, res) {
  var notifs = db.get('notifications')
    .filter({ userId: req.user.id })
    .value()
    .sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt) })
  var unread = notifs.filter(function(n) { return !n.read }).length
  res.json({ notifications: notifs, unread: unread })
})

// PATCH /api/notifications/read-all
router.patch('/read-all', auth, function(req, res) {
  db.get('notifications')
    .filter({ userId: req.user.id })
    .each(function(n) { n.read = true })
    .write()
  res.json({ success: true })
})

// Helper — call this from orders route when order is placed
router.createNotification = function(userId, title, message, type) {
  var notif = {
    id:        uuidv4(),
    userId:    userId,
    title:     title,
    message:   message,
    type:      type || 'info',
    read:      false,
    createdAt: new Date().toISOString(),
  }
  db.get('notifications').push(notif).write()
  return notif
}

module.exports = router