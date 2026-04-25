const express = require('express')
const router  = express.Router()
const { Listing, User } = require('../db')
const auth    = require('../middleware/auth')

router.get('/', async function(req, res) {
  try {
    var query = { isActive: true }
    var { category, city, area, search, sort, condition } = req.query
    if (category && category !== 'all') query.category = category
    if (city)      query.city = new RegExp(city, 'i')
    if (area)      query.area = new RegExp(area, 'i')
    if (condition) query.condition = condition
    if (search) {
      query['$or'] = [
        { title:       new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { location:    new RegExp(search, 'i') },
      ]
    }
    var sortObj = { createdAt: -1 }
    if (sort === 'price_asc')  sortObj = { price: 1 }
    if (sort === 'price_desc') sortObj = { price: -1 }
    if (sort === 'oldest')     sortObj = { createdAt: 1 }

    var listings = await Listing.find(query).sort(sortObj)
    res.json({ listings, total: listings.length })
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/user/:userId', async function(req, res) {
  try {
    var listings = await Listing.find({ userId: req.params.userId, isActive: true })
    res.json({ listings, total: listings.length })
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id', async function(req, res) {
  try {
    var listing = await Listing.findById(req.params.id)
    if (!listing || !listing.isActive) return res.status(404).json({ error: 'Listing not found' })
    listing.views = (listing.views || 0) + 1
    await listing.save()
    res.json(listing)
  } catch(err) {
    res.status(404).json({ error: 'Listing not found' })
  }
})

router.post('/', auth, async function(req, res) {
  try {
    var { title, description, price, isNegotiable, category, condition, images, location, area, city } = req.body
    if (!title || !price || !category) return res.status(400).json({ error: 'Title, price and category required' })
    var user = await User.findById(req.user.id)
    var listing = await Listing.create({
      userId: req.user.id,
      title, description: description || '',
      price: parseInt(price), isNegotiable: isNegotiable || false,
      category, condition: condition || 'Good',
      images: images || [],
      location: location || '', area: area || '', city: city || '',
      sellerName:  user ? user.name  : req.user.name,
      sellerPhone: user ? user.phone : '',
      isVerified:  user ? user.isVerified : false,
    })
    res.status(201).json(listing)
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', auth, async function(req, res) {
  try {
    var listing = await Listing.findById(req.params.id)
    if (!listing) return res.status(404).json({ error: 'Not found' })
    if (listing.userId.toString() !== req.user.id) return res.status(403).json({ error: 'Not authorized' })
    Object.assign(listing, req.body)
    await listing.save()
    res.json(listing)
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', auth, async function(req, res) {
  try {
    var listing = await Listing.findById(req.params.id)
    if (!listing) return res.status(404).json({ error: 'Not found' })
    if (listing.userId.toString() !== req.user.id) return res.status(403).json({ error: 'Not authorized' })
    listing.isActive = false
    await listing.save()
    res.json({ message: 'Listing removed' })
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router