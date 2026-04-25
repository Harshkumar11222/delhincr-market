const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const db = require('../db')
const authMiddleware = require('../middleware/auth')
const notifRouter = require('./notifications')

// POST /api/orders — place a new order
router.post('/', authMiddleware, (req, res) => {
  try {
    const { listingId, address, paymentMethod, note } = req.body
    if (!listingId || !address) {
      return res.status(400).json({ error: 'Listing ID and address are required' })
    }

    const listing = db.get('listings').find({ id: listingId, isActive: true }).value()
    if (!listing) return res.status(404).json({ error: 'Listing not found' })

    // buyer cannot buy own listing
    if (listing.userId === req.user.id) {
      return res.status(400).json({ error: 'Aap apni khud ki listing nahi khareed sakte' })
    }

    const order = {
      id: uuidv4(),
      listingId,
      listingTitle: listing.title,
      listingImage: listing.images?.[0] || '',
      listingPrice: listing.price,
      listingLocation: listing.location,

      buyerId: req.user.id,
      buyerName: req.user.name,

      sellerId: listing.userId,
      sellerName: listing.sellerName,
      sellerPhone: listing.sellerPhone,

      address,
      paymentMethod: paymentMethod || 'Cash on Meetup',
      note: note || '',

      status: 'pending',
      // pending → confirmed → completed / cancelled
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    db.get('orders').push(order).write()
    // Seller ko notification bhejo
    notifRouter.createNotification(
        listing.userId,
        'Naya Order Aaya! 🛒',
        req.user.name + ' ne "' + listing.title + '" ke liye order kiya',
        'order'
    )
    res.status(201).json(order)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/orders/my — get all orders for logged in user (as buyer + seller)
router.get('/my', authMiddleware, (req, res) => {
  const bought = db.get('orders').filter({ buyerId: req.user.id }).value()
  const sold   = db.get('orders').filter({ sellerId: req.user.id }).value()

  // sort newest first
  const sortByDate = arr => [...arr].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  res.json({
    bought: sortByDate(bought),
    sold:   sortByDate(sold),
  })
})

// GET /api/orders/:id — single order
router.get('/:id', authMiddleware, (req, res) => {
  const order = db.get('orders').find({ id: req.params.id }).value()
  if (!order) return res.status(404).json({ error: 'Order not found' })

  // only buyer or seller can view
  if (order.buyerId !== req.user.id && order.sellerId !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized' })
  }
  res.json(order)
})

// PATCH /api/orders/:id/status — update order status
router.patch('/:id/status', authMiddleware, (req, res) => {
  const { status } = req.body
  const allowed = ['pending', 'confirmed', 'completed', 'cancelled']

  if (!allowed.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' })
  }

  const order = db.get('orders').find({ id: req.params.id }).value()
  if (!order) return res.status(404).json({ error: 'Order not found' })

  if (order.buyerId !== req.user.id && order.sellerId !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized' })
  }

  db.get('orders').find({ id: req.params.id })
    .assign({ status, updatedAt: new Date().toISOString() })
    .write()
  // Buyer ko notification bhejo
  notifRouter.createNotification(
    order.buyerId,
    'Order Update 📦',
    'Aapka order "' + order.listingTitle + '" ' + status + ' ho gaya',
    'status'
  )
  res.json({ ...order, status })
})

module.exports = router