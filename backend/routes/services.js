const express = require('express')
const router  = express.Router()
const { Service, User } = require('../db')
const auth    = require('../middleware/auth')

router.get('/', async function(req, res) {
  try {
    var query = {}
    var { category, city, area, search } = req.query
    if (category && category !== 'all') query.category = category
    if (city)   query.city = new RegExp(city, 'i')
    if (area)   query.area = new RegExp(area, 'i')
    if (search) {
      query['$or'] = [
        { name:         new RegExp(search, 'i') },
        { providerName: new RegExp(search, 'i') },
        { description:  new RegExp(search, 'i') },
      ]
    }
    var services = await Service.find(query).sort({ rating: -1 })
    res.json({ services, total: services.length })
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id', async function(req, res) {
  try {
    var service = await Service.findById(req.params.id)
    if (!service) return res.status(404).json({ error: 'Not found' })
    res.json(service)
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', auth, async function(req, res) {
  try {
    var { name, category, description, priceFrom, priceTo, experience, location, area, city, phone } = req.body
    if (!name || !category || !phone) return res.status(400).json({ error: 'Name, category and phone required' })
    var user = await User.findById(req.user.id)
    var service = await Service.create({
      userId: req.user.id,
      name, category, description: description || '',
      priceFrom: parseInt(priceFrom) || 0,
      priceTo:   parseInt(priceTo)   || 0,
      experience:parseInt(experience)|| 0,
      location: location || '', area: area || '', city: city || '',
      phone, providerName: user ? user.name : req.user.name,
      avatar: user ? user.avatar : '',
    })
    res.status(201).json(service)
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router