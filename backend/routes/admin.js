const express  = require('express')
const router   = express.Router()
const adminAuth = require('../middleware/admin')
const { User, Listing, Service, Order, Rental } = require('../db')

// ── DASHBOARD STATS ──────────────────────────────
router.get('/stats', adminAuth, async function(req, res) {
  try {
    const [
      totalUsers, totalListings, totalOrders,
      totalServices, totalRentals,
      activeListings, pendingOrders,
    ] = await Promise.all([
      User.countDocuments(),
      Listing.countDocuments(),
      Order.countDocuments(),
      Service.countDocuments(),
      Rental.countDocuments(),
      Listing.countDocuments({ isActive: true }),
      Order.countDocuments({ status: 'pending' }),
    ])

    const recentUsers    = await User.find().sort({ createdAt: -1 }).limit(5).select('-passwordHash')
    const recentOrders   = await Order.find().sort({ createdAt: -1 }).limit(5)
    const recentListings = await Listing.find().sort({ createdAt: -1 }).limit(5)

    res.json({
      stats: {
        totalUsers, totalListings, totalOrders,
        totalServices, totalRentals,
        activeListings, pendingOrders,
      },
      recentUsers,
      recentOrders,
      recentListings,
    })
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

// ── USERS ─────────────────────────────────────────
router.get('/users', adminAuth, async function(req, res) {
  try {
    var page    = parseInt(req.query.page) || 1
    var limit   = parseInt(req.query.limit) || 20
    var search  = req.query.search
    var query   = {}
    if (search) {
      query['$or'] = [
        { name:  new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') },
      ]
    }
    var total = await User.countDocuments(query)
    var users = await User.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
    res.json({ users, total, page, pages: Math.ceil(total / limit) })
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

// Verify user
router.patch('/users/:id/verify', adminAuth, async function(req, res) {
  try {
    var user = await User.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true }).select('-passwordHash')
    res.json(user)
  } catch(err) { res.status(500).json({ error: err.message }) }
})

// Ban/Unban user
router.patch('/users/:id/ban', adminAuth, async function(req, res) {
  try {
    var user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    user.isBanned = !user.isBanned
    await user.save()
    res.json({ message: user.isBanned ? 'User banned' : 'User unbanned', isBanned: user.isBanned })
  } catch(err) { res.status(500).json({ error: err.message }) }
})

// Make admin
router.patch('/users/:id/make-admin', adminAuth, async function(req, res) {
  try {
    var user = await User.findByIdAndUpdate(req.params.id, { isAdmin: true }, { new: true }).select('-passwordHash')
    res.json(user)
  } catch(err) { res.status(500).json({ error: err.message }) }
})

// Delete user
router.delete('/users/:id', adminAuth, async function(req, res) {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.json({ message: 'User deleted' })
  } catch(err) { res.status(500).json({ error: err.message }) }
})

// ── LISTINGS ──────────────────────────────────────
router.get('/listings', adminAuth, async function(req, res) {
  try {
    var page   = parseInt(req.query.page) || 1
    var limit  = parseInt(req.query.limit) || 20
    var search = req.query.search
    var query  = {}
    if (search) query['$or'] = [{ title: new RegExp(search, 'i') }, { sellerName: new RegExp(search, 'i') }]
    var total    = await Listing.countDocuments(query)
    var listings = await Listing.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit)
    res.json({ listings, total, page, pages: Math.ceil(total / limit) })
  } catch(err) { res.status(500).json({ error: err.message }) }
})

// Delete listing
router.delete('/listings/:id', adminAuth, async function(req, res) {
  try {
    await Listing.findByIdAndUpdate(req.params.id, { isActive: false })
    res.json({ message: 'Listing removed' })
  } catch(err) { res.status(500).json({ error: err.message }) }
})

// Feature listing
router.patch('/listings/:id/feature', adminAuth, async function(req, res) {
  try {
    var listing = await Listing.findById(req.params.id)
    listing.isFeatured = !listing.isFeatured
    await listing.save()
    res.json({ message: listing.isFeatured ? 'Featured!' : 'Unfeatured', isFeatured: listing.isFeatured })
  } catch(err) { res.status(500).json({ error: err.message }) }
})

// ── ORDERS ────────────────────────────────────────
router.get('/orders', adminAuth, async function(req, res) {
  try {
    var page   = parseInt(req.query.page) || 1
    var limit  = parseInt(req.query.limit) || 20
    var status = req.query.status
    var query  = {}
    if (status && status !== 'all') query.status = status
    var total  = await Order.countDocuments(query)
    var orders = await Order.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit)
    res.json({ orders, total, page, pages: Math.ceil(total / limit) })
  } catch(err) { res.status(500).json({ error: err.message }) }
})

// ── SERVICES ──────────────────────────────────────
router.get('/services', adminAuth, async function(req, res) {
  try {
    var services = await Service.find().sort({ createdAt: -1 })
    res.json({ services, total: services.length })
  } catch(err) { res.status(500).json({ error: err.message }) }
})

// Delete service
router.delete('/services/:id', adminAuth, async function(req, res) {
  try {
    await Service.findByIdAndDelete(req.params.id)
    res.json({ message: 'Service deleted' })
  } catch(err) { res.status(500).json({ error: err.message }) }
})

// ── RENTALS ───────────────────────────────────────
router.get('/rentals', adminAuth, async function(req, res) {
  try {
    var rentals = await Rental.find().sort({ createdAt: -1 })
    res.json({ rentals, total: rentals.length })
  } catch(err) { res.status(500).json({ error: err.message }) }
})

// Delete rental
router.delete('/rentals/:id', adminAuth, async function(req, res) {
  try {
    await Rental.findByIdAndUpdate(req.params.id, { isAvailable: false })
    res.json({ message: 'Rental removed' })
  } catch(err) { res.status(500).json({ error: err.message }) }
})

module.exports = router