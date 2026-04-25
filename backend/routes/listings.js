const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const db = require('../db')
const authMiddleware = require('../middleware/auth')

// GET /api/listings - get all with filters
router.get('/', (req, res) => {
  try {
    let listings = db.get('listings').filter({ isActive: true }).value()
    const { category, city, area, search, sort, minPrice, maxPrice, condition } = req.query

    if (category && category !== 'all') {
      listings = listings.filter(l => l.category === category)
    }
    if (city) listings = listings.filter(l => l.city.toLowerCase().includes(city.toLowerCase()))
    if (area) listings = listings.filter(l => l.area.toLowerCase().includes(area.toLowerCase()))
    if (condition) listings = listings.filter(l => l.condition === condition)
    if (minPrice) listings = listings.filter(l => l.price >= parseInt(minPrice))
    if (maxPrice) listings = listings.filter(l => l.price <= parseInt(maxPrice))
    if (search) {
      const q = search.toLowerCase()
      listings = listings.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q)
      )
    }
    if (sort === 'price_asc') listings.sort((a, b) => a.price - b.price)
    else if (sort === 'price_desc') listings.sort((a, b) => b.price - a.price)
    else if (sort === 'oldest') listings.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    else listings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    res.json({ listings, total: listings.length })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/listings/:id - single listing
router.get('/:id', (req, res) => {
  const listing = db.get('listings').find({ id: req.params.id, isActive: true }).value()
  if (!listing) return res.status(404).json({ error: 'Listing not found' })
  // increment views
  db.get('listings').find({ id: req.params.id }).assign({ views: (listing.views || 0) + 1 }).write()
  res.json(listing)
})

// POST /api/listings - create listing (auth required)
router.post('/', authMiddleware, (req, res) => {
  try {
    const { title, description, price, isNegotiable, category, condition, images, location, area, city } = req.body
    if (!title || !price || !category) {
      return res.status(400).json({ error: 'Title, price and category are required' })
    }
    const user = db.get('users').find({ id: req.user.id }).value()
    const listing = {
      id: uuidv4(),
      userId: req.user.id,
      title,
      description: description || '',
      price: parseInt(price),
      isNegotiable: isNegotiable || false,
      category,
      condition: condition || 'Good',
      images: images || [],
      location: location || '',
      area: area || '',
      city: city || '',
      sellerName: user ? user.name : req.user.name,
      sellerPhone: user ? user.phone : '',
      isVerified: user ? user.isVerified : false,
      views: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
    }
    db.get('listings').push(listing).write()
    res.status(201).json(listing)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/listings/:id - update listing (auth required, own only)
router.put('/:id', authMiddleware, (req, res) => {
  const listing = db.get('listings').find({ id: req.params.id }).value()
  if (!listing) return res.status(404).json({ error: 'Listing not found' })
  if (listing.userId !== req.user.id) return res.status(403).json({ error: 'Not authorized' })

  const updated = { ...listing, ...req.body, id: listing.id, userId: listing.userId }
  db.get('listings').find({ id: req.params.id }).assign(updated).write()
  res.json(updated)
})

// DELETE /api/listings/:id - soft delete (auth required, own only)
router.delete('/:id', authMiddleware, (req, res) => {
  const listing = db.get('listings').find({ id: req.params.id }).value()
  if (!listing) return res.status(404).json({ error: 'Listing not found' })
  if (listing.userId !== req.user.id) return res.status(403).json({ error: 'Not authorized' })
  db.get('listings').find({ id: req.params.id }).assign({ isActive: false }).write()
  res.json({ message: 'Listing removed' })
})

// GET /api/listings/user/:userId - get listings by user
router.get('/user/:userId', (req, res) => {
  const listings = db.get('listings').filter({ userId: req.params.userId, isActive: true }).value()
  res.json({ listings, total: listings.length })
})

module.exports = router