const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const db = require('../db')
const authMiddleware = require('../middleware/auth')

// GET /api/services
router.get('/', (req, res) => {
  try {
    let services = db.get('services').value()
    const { category, city, area, search } = req.query

    if (category && category !== 'all') services = services.filter(s => s.category === category)
    if (city) services = services.filter(s => s.city.toLowerCase().includes(city.toLowerCase()))
    if (area) services = services.filter(s => s.area.toLowerCase().includes(area.toLowerCase()))
    if (search) {
      const q = search.toLowerCase()
      services = services.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.providerName.toLowerCase().includes(q)
      )
    }
    services.sort((a, b) => b.rating - a.rating)
    res.json({ services, total: services.length })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/services/categories
router.get('/categories', (req, res) => {
  res.json(db.get('serviceCategories').value())
})

// GET /api/services/:id
router.get('/:id', (req, res) => {
  const service = db.get('services').find({ id: req.params.id }).value()
  if (!service) return res.status(404).json({ error: 'Service not found' })
  res.json(service)
})

// POST /api/services (auth required)
router.post('/', authMiddleware, (req, res) => {
  try {
    const { name, category, description, priceFrom, priceTo, experience, location, area, city, phone } = req.body
    if (!name || !category || !phone) {
      return res.status(400).json({ error: 'Name, category and phone are required' })
    }
    const user = db.get('users').find({ id: req.user.id }).value()
    const service = {
      id: uuidv4(), userId: req.user.id,
      name, category, description: description || '',
      priceFrom: parseInt(priceFrom) || 0,
      priceTo: parseInt(priceTo) || 0,
      experience: parseInt(experience) || 0,
      rating: 0, totalRatings: 0, completedJobs: 0,
      location: location || '', area: area || '', city: city || '',
      isVerified: false, phone,
      providerName: user ? user.name : req.user.name,
      avatar: user ? user.avatar : '',
      createdAt: new Date().toISOString(),
    }
    db.get('services').push(service).write()
    res.status(201).json(service)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router