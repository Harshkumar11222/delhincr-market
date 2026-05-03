const express = require('express')
const router  = express.Router()
const { Rental, User } = require('../db')
const auth    = require('../middleware/auth')

// GET /api/rentals
router.get('/', async function(req, res) {
  try {
    var query = { isAvailable: true }
    var type   = req.query.type
    var city   = req.query.city
    var search = req.query.search
    var minPrice = req.query.minPrice
    var maxPrice = req.query.maxPrice

    if (type && type !== 'all') query.type = type
    if (city) query.city = new RegExp(city, 'i')
    if (minPrice) query.pricePerDay = { $gte: parseInt(minPrice) }
    if (maxPrice) query.pricePerDay = { ...query.pricePerDay, $lte: parseInt(maxPrice) }
    if (search) {
      query['$or'] = [
        { title:       new RegExp(search, 'i') },
        { brand:       new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
      ]
    }
    var rentals = await Rental.find(query).sort({ createdAt: -1 })
    res.json({ rentals, total: rentals.length })
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/rentals/:id
router.get('/:id', async function(req, res) {
  try {
    var rental = await Rental.findById(req.params.id)
    if (!rental) return res.status(404).json({ error: 'Not found' })
    rental.views = (rental.views || 0) + 1
    await rental.save()
    res.json(rental)
  } catch(err) {
    res.status(404).json({ error: 'Not found' })
  }
})

// POST /api/rentals
router.post('/', auth, async function(req, res) {
  try {
    var { title, type, brand, model, year, description, pricePerDay, pricePerHour, images, location, area, city, ownerPhone, features } = req.body
    if (!title || !type || !pricePerDay || !ownerPhone) {
      return res.status(400).json({ error: 'Title, type, price aur phone required hai' })
    }
    var user = await User.findById(req.user.id)
    var rental = await Rental.create({
      userId:       req.user.id,
      title, type, brand, model,
      year:         parseInt(year) || 2020,
      description:  description || '',
      pricePerDay:  parseInt(pricePerDay),
      pricePerHour: parseInt(pricePerHour) || 0,
      images:       images || [],
      location:     location || '',
      area:         area || '',
      city:         city || '',
      ownerName:    user ? user.name : req.user.name,
      ownerPhone:   ownerPhone,
      features:     features || [],
      isVerified:   user ? user.isVerified : false,
    })
    res.status(201).json(rental)
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/rentals/:id
router.delete('/:id', auth, async function(req, res) {
  try {
    var rental = await Rental.findById(req.params.id)
    if (!rental) return res.status(404).json({ error: 'Not found' })
    if (rental.userId.toString() !== req.user.id) return res.status(403).json({ error: 'Not authorized' })
    rental.isAvailable = false
    await rental.save()
    res.json({ message: 'Rental removed' })
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router