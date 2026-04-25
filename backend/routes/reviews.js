const express = require('express')
const router  = express.Router()
const { v4: uuidv4 } = require('uuid')
const db      = require('../db')
const auth    = require('../middleware/auth')

// GET /api/reviews/seller/:sellerId
router.get('/seller/:sellerId', function(req, res) {
  var reviews = db.get('reviews')
    .filter({ sellerId: req.params.sellerId })
    .value()
  var avg = 0
  if (reviews.length > 0) {
    avg = reviews.reduce(function(a, r) { return a + r.rating }, 0) / reviews.length
  }
  res.json({ reviews: reviews, average: Math.round(avg * 10) / 10, total: reviews.length })
})

// GET /api/reviews/listing/:listingId
router.get('/listing/:listingId', function(req, res) {
  var reviews = db.get('reviews')
    .filter({ listingId: req.params.listingId })
    .value()
  res.json({ reviews: reviews, total: reviews.length })
})

// POST /api/reviews — add review (auth required)
router.post('/', auth, function(req, res) {
  var orderId   = req.body.orderId
  var rating    = req.body.rating
  var comment   = req.body.comment
  var listingId = req.body.listingId

  if (!orderId || !rating || !listingId) {
    return res.status(400).json({ error: 'orderId, rating, listingId required' })
  }

  var order = db.get('orders').find({ id: orderId }).value()
  if (!order) return res.status(404).json({ error: 'Order not found' })
  if (order.buyerId !== req.user.id) return res.status(403).json({ error: 'Only buyer can review' })
  if (order.status !== 'completed') return res.status(400).json({ error: 'Order must be completed first' })

  var existing = db.get('reviews').find({ orderId: orderId }).value()
  if (existing) return res.status(400).json({ error: 'Already reviewed this order' })

  var review = {
    id:         uuidv4(),
    orderId:    orderId,
    listingId:  listingId,
    sellerId:   order.sellerId,
    buyerId:    req.user.id,
    buyerName:  req.user.name,
    rating:     parseInt(rating),
    comment:    comment || '',
    createdAt:  new Date().toISOString(),
  }

  db.get('reviews').push(review).write()
  res.status(201).json(review)
})

module.exports = router