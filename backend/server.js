const express = require('express')
const cors = require('cors')
const path = require('path')
const db = require('./db')
// Pehli line pe add karo
require('dotenv').config()
const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://delhincr-market-git-main-harshkumar11222s-projects.vercel.app',
  ]
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/auth',     require('./routes/auth'))
app.use('/api/listings', require('./routes/listings'))
app.use('/api/services', require('./routes/services'))
app.use('/api/orders',   require('./routes/orders'))   
app.use('/api/upload', require('./routes/upload'))
app.use('/api/reviews',       require('./routes/reviews'))
app.use('/api/notifications', require('./routes/notifications'))
app.use('/api/otp', require('./routes/otp'))

// Categories
app.get('/api/categories', (req, res) => {
  res.json(db.get('categories').value())
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'DelhiNCR Market API running 🚀' })
})

app.listen(PORT, () => {
  console.log(`\n🚀 DelhiNCR Market Backend running on http://localhost:${PORT}`)
  console.log(`📦 Database: db.json`)
  console.log(`🔗 API Health: http://localhost:${PORT}/api/health\n`)
})