const express = require('express')
const router  = express.Router()
const { Review, Order } = require('../db')
const auth    = require('../middleware/auth')

router.get('/listing/:listingId', async function(req, res) {
  try {
    var reviews = await Review.find({ listingId: req.params.listingId })
    res.json({ reviews, total: reviews.length })
  } catch(err) {
    res.json({ reviews: [], total: 0 })
  }
})

router.get('/seller/:sellerId', async function(req, res) {
  try {
    var reviews = await Review.find({ sellerId: req.params.sellerId })
    var avg = 0
    if (reviews.length > 0) {
      avg = reviews.reduce(function(a, r) { return a + r.rating }, 0) / reviews.length
    }
    res.json({ reviews, average: Math.round(avg * 10) / 10, total: reviews.length })
  } catch(err) {
    res.json({ reviews: [], average: 0, total: 0 })
  }
})

router.post('/', auth, async function(req, res) {
  try {
    var { orderId, rating, comment, listingId } = req.body
    if (!orderId || !rating || !listingId) return res.status(400).json({ error: 'orderId, rating, listingId required' })

    var order = await Order.findById(orderId)
    if (!order) return res.status(404).json({ error: 'Order not found' })
    if (order.buyerId.toString() !== req.user.id) return res.status(403).json({ error: 'Only buyer can review' })
    if (order.status !== 'completed') return res.status(400).json({ error: 'Order must be completed first' })

    var review = await Review.create({
      orderId, listingId,
      sellerId:  order.sellerId,
      buyerId:   req.user.id,
      buyerName: req.user.name,
      rating:    parseInt(rating),
      comment:   comment || '',
    })
    res.status(201).json(review)
  } catch(err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Already reviewed' })
    res.status(500).json({ error: err.message })
  }
})

module.exports = router