const express      = require('express')
const cors         = require('cors')
const path         = require('path')
const http         = require('http')
const { Server }   = require('socket.io')
const helmet       = require('helmet')
const rateLimit    = require('express-rate-limit')
const xss          = require('xss-clean')
const hpp          = require('hpp')
const mongoSanitize = require('express-mongo-sanitize')

const app    = express()
const server = http.createServer(app)
const io     = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
})
const PORT = process.env.PORT || 5000

// ═══════════════════════════════════════
// SECURITY MIDDLEWARE
// ═══════════════════════════════════════

// 1. Helmet — HTTP headers secure karo
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}))

// 2. CORS
app.use(cors({ origin: '*' }))

// 3. Rate Limiting — DDoS protection
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: 'Bahut zyada requests! 15 minute baad try karo.' },
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api/', globalLimiter)

// Auth routes ke liye strict limit
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Bahut zyada login attempts! 15 minute baad try karo.' },
})
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)
app.use('/api/otp/send', authLimiter)

// OTP ke liye extra strict
const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { error: 'OTP limit exceed! 1 ghante baad try karo.' },
})
app.use('/api/auth/forgot-password', otpLimiter)

// 4. Body Parser
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// 5. XSS Protection — HTML injection rokta hai
app.use(xss())

// 6. MongoDB Injection Protection
app.use(mongoSanitize())

// 7. HTTP Parameter Pollution Protection
app.use(hpp())

// 8. Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ═══════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════

try { app.use('/api/auth',          require('./routes/auth'))          } catch(e) { console.log('auth error:', e.message) }
try { app.use('/api/listings',      require('./routes/listings'))      } catch(e) { console.log('listings error:', e.message) }
try { app.use('/api/services',      require('./routes/services'))      } catch(e) { console.log('services error:', e.message) }
try { app.use('/api/orders',        require('./routes/orders'))        } catch(e) { console.log('orders error:', e.message) }
try { app.use('/api/upload',        require('./routes/upload'))        } catch(e) { console.log('upload error:', e.message) }
try { app.use('/api/reviews',       require('./routes/reviews'))       } catch(e) { console.log('reviews error:', e.message) }
try { app.use('/api/notifications', require('./routes/notifications')) } catch(e) { console.log('notifications error:', e.message) }
try { app.use('/api/otp',           require('./routes/otp'))           } catch(e) { console.log('otp error:', e.message) }
try { app.use('/api/chat',          require('./routes/chat'))          } catch(e) { console.log('chat error:', e.message) }

app.get('/api/categories', function(req, res) {
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
})

// Health check
app.get('/api/health', function(req, res) {
  res.json({ status: 'ok', message: 'DelhiNCR Market API running 🚀' })
})

// 404 handler
app.use('/api/*', function(req, res) {
  res.status(404).json({ error: 'Route not found' })
})

// Global error handler
app.use(function(err, req, res, next) {
  console.error('Error:', err.message)
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Something went wrong'
      : err.message
  })
})

// ═══════════════════════════════════════
// SOCKET.IO
// ═══════════════════════════════════════

var onlineUsers = {}

io.on('connection', function(socket) {
  socket.on('user_online', function(userId) {
    onlineUsers[userId] = socket.id
    socket.userId = userId
  })
  socket.on('join_room', function(roomId) {
    socket.join(roomId)
  })
  socket.on('send_message', function(data) {
    var msgData = {
      id:         Date.now().toString(),
      senderId:   data.senderId,
      senderName: data.senderName,
      message:    data.message,
      roomId:     data.roomId,
      listingId:  data.listingId,
      createdAt:  new Date().toISOString(),
    }
    io.to(data.roomId).emit('receive_message', msgData)
  })
  socket.on('disconnect', function() {
    if (socket.userId) delete onlineUsers[socket.userId]
  })
})

server.listen(PORT, function() {
  console.log('\n🚀 DelhiNCR Market Backend running on port ' + PORT)
  console.log('🔒 Security middleware active!')
  console.log('💬 Socket.io Chat ready!')
})