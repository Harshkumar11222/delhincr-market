const express = require('express')
const router  = express.Router()
const { Order, Listing } = require('../db')
const auth    = require('../middleware/auth')

var notifRouter = null
try { notifRouter = require('./notifications') } catch(e) {}

function sendNotification(userId, title, message, type) {
  try {
    if (notifRouter && notifRouter.createNotification) {
      notifRouter.createNotification(userId, title, message, type)
    }
  } catch(e) {}
}

router.post('/', auth, async function(req, res) {
  try {
    var { listingId, address, paymentMethod, note } = req.body
    if (!listingId || !address) return res.status(400).json({ error: 'listingId and address required' })

    var listing = await Listing.findById(listingId)
    if (!listing || !listing.isActive) return res.status(404).json({ error: 'Listing not found' })
    if (listing.userId.toString() === req.user.id) return res.status(400).json({ error: 'Apni khud ki listing nahi khareed sakte' })

    var order = await Order.create({
      listingId:       listingId,
      listingTitle:    listing.title,
      listingImage:    listing.images && listing.images[0] ? listing.images[0] : '',
      listingPrice:    listing.price,
      listingLocation: listing.location,
      buyerId:         req.user.id,
      buyerName:       req.user.name,
      sellerId:        listing.userId,
      sellerName:      listing.sellerName,
      sellerPhone:     listing.sellerPhone,
      address:         address,
      paymentMethod:   paymentMethod || 'Cash on Meetup',
      note:            note || '',
      status:          'pending',
    })

    sendNotification(listing.userId.toString(), 'Naya Order! 🛒', req.user.name + ' ne "' + listing.title + '" order kiya', 'order')
    res.status(201).json(order)
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/my', auth, async function(req, res) {
  try {
    var bought = await Order.find({ buyerId:  req.user.id }).sort({ createdAt: -1 })
    var sold   = await Order.find({ sellerId: req.user.id }).sort({ createdAt: -1 })
    res.json({ bought, sold })
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id', auth, async function(req, res) {
  try {
    var order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ error: 'Order not found' })
    if (order.buyerId.toString() !== req.user.id && order.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' })
    }
    res.json(order)
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

router.patch('/:id/status', auth, async function(req, res) {
  try {
    var { status } = req.body
    var allowed = ['pending', 'confirmed', 'completed', 'cancelled']
    if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' })

    var order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ error: 'Order not found' })
    if (order.buyerId.toString() !== req.user.id && order.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' })
    }
    order.status = status
    await order.save()

    sendNotification(order.buyerId.toString(), 'Order Update 📦', 'Aapka order "' + order.listingTitle + '" ' + status + ' ho gaya', 'status')
    res.json(order)
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router