const express = require('express')
const cors    = require('cors')
const path    = require('path')

const app  = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

try { app.use('/api/auth',          require('./routes/auth'))          } catch(e) { console.log('auth error:', e.message) }
try { app.use('/api/listings',      require('./routes/listings'))      } catch(e) { console.log('listings error:', e.message) }
try { app.use('/api/services',      require('./routes/services'))      } catch(e) { console.log('services error:', e.message) }
try { app.use('/api/orders',        require('./routes/orders'))        } catch(e) { console.log('orders error:', e.message) }
try { app.use('/api/upload',        require('./routes/upload'))        } catch(e) { console.log('upload error:', e.message) }
try { app.use('/api/reviews',       require('./routes/reviews'))       } catch(e) { console.log('reviews error:', e.message) }
try { app.use('/api/notifications', require('./routes/notifications')) } catch(e) { console.log('notifications error:', e.message) }
try { app.use('/api/otp',           require('./routes/otp'))           } catch(e) { console.log('otp error:', e.message) }

app.get('/api/categories', function(req, res) {
  try {
    const { Listing } = require('./db')
    res.json([
      { id: 'electronics', name: 'Electronics', icon: '📱' },
      { id: 'vehicles',    name: 'Vehicles',    icon: '🚗' },
      { id: 'furniture',   name: 'Furniture',   icon: '🛋️' },
      { id: 'appliances',  name: 'Appliances',  icon: '🏠' },
      { id: 'books',       name: 'Books',       icon: '📚' },
      { id: 'clothing',    name: 'Clothing',    icon: '👗' },
      { id: 'sports',      name: 'Sports',      icon: '⚽' },
      { id: 'toys',        name: 'Toys',        icon: '🧸' },
    ])
  } catch(e) { res.json([]) }
})

app.get('/api/health', function(req, res) {
  res.json({ status: 'ok', message: 'DelhiNCR Market API running 🚀' })
})

app.listen(PORT, function() {
  console.log('\n🚀 DelhiNCR Market Backend running on port ' + PORT)
})