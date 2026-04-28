const express = require('express')
const router  = express.Router()
const { Message } = require('../db')
const auth    = require('../middleware/auth')

// GET /api/chat/:roomId — messages fetch karo
router.get('/:roomId', auth, async function(req, res) {
  try {
    var messages = await Message.find({ roomId: req.params.roomId })
      .sort({ createdAt: 1 })
      .limit(50)
    res.json({ messages })
  } catch(err) {
    res.json({ messages: [] })
  }
})

// POST /api/chat/save — message save karo DB mein
router.post('/save', auth, async function(req, res) {
  try {
    var { roomId, message, listingId, receiverId } = req.body
    var msg = await Message.create({
      roomId,
      senderId:   req.user.id,
      senderName: req.user.name,
      receiverId: receiverId || '',
      message,
      listingId:  listingId || '',
    })
    res.status(201).json(msg)
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/chat/conversations/my — meri saari conversations
router.get('/conversations/my', auth, async function(req, res) {
  try {
    var messages = await Message.find({
      '$or': [
        { senderId:   req.user.id },
        { receiverId: req.user.id },
      ]
    }).sort({ createdAt: -1 })

    // Unique rooms nikalo
    var rooms = {}
    messages.forEach(function(m) {
      if (!rooms[m.roomId]) {
        rooms[m.roomId] = {
          roomId:      m.roomId,
          listingId:   m.listingId,
          lastMessage: m.message,
          lastTime:    m.createdAt,
          otherPerson: m.senderId === req.user.id ? m.receiverId : m.senderId,
          otherName:   m.senderId === req.user.id ? m.receiverName : m.senderName,
        }
      }
    })
    res.json({ conversations: Object.values(rooms) })
  } catch(err) {
    res.json({ conversations: [] })
  }
})

module.exports = router