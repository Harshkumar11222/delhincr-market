const express       = require('express')
const cors          = require('cors')
const path          = require('path')
const http          = require('http')
const { Server }    = require('socket.io')
const helmet        = require('helmet')
const rateLimit     = require('express-rate-limit')
const slowDown      = require('express-slow-down')
const xss           = require('xss-clean')
const hpp           = require('hpp')
const mongoSanitize = require('express-mongo-sanitize')

const app    = express()
const server = http.createServer(app)
const io     = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
})
const PORT = process.env.PORT || 5000

// ═══════════════════════════════════════════
// 1. HELMET — Secure HTTP Headers
// ═══════════════════════════════════════════
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))

// ═══════════════════════════════════════════
// 2. CORS — Robust, never breaks
// ═══════════════════════════════════════════
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.options('*', cors())

// Extra safety — CORS header har response pe force karo, chahe kuch bhi ho
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

// ═══════════════════════════════════════════
// 3. TRUST PROXY (Render ke liye)
// ═══════════════════════════════════════════
app.set('trust proxy', 1)

// ═══════════════════════════════════════════
// 4. BODY SIZE LIMIT — Large payload attack
// ═══════════════════════════════════════════
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// ═══════════════════════════════════════════
// 5. XSS PROTECTION
// ═══════════════════════════════════════════
app.use(xss())

// ═══════════════════════════════════════════
// 6. NOSQL INJECTION PROTECTION
// ═══════════════════════════════════════════
app.use(mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`⚠️ NoSQL injection attempt blocked: ${key}`)
  }
}))

// ═══════════════════════════════════════════
// 7. HTTP PARAMETER POLLUTION
// ═══════════════════════════════════════════
app.use(hpp({
  whitelist: ['sort', 'page', 'limit', 'category', 'city', 'type']
}))

// ═══════════════════════════════════════════
// 8. RATE LIMITING — DDoS/DoS Protection
// ═══════════════════════════════════════════

// Global limit — 200 req per 15 min
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  handler: function(req, res) {
    console.warn('🚨 Rate limit hit:', req.ip)
    res.status(429).json({
      error: 'Bahut zyada requests! 15 minute baad try karo.',
      retryAfter: Math.ceil(15 * 60),
    })
  }
})
app.use('/api/', globalLimiter)

// Auth routes — strict (10 req per 15 min)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  handler: function(req, res) {
    console.warn('🚨 Auth rate limit hit:', req.ip)
    res.status(429).json({ error: 'Bahut zyada login attempts! 15 minute baad try karo.' })
  }
})
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)

// OTP — very strict (5 per hour)
const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  handler: function(req, res) {
    res.status(429).json({ error: 'OTP limit exceed! 1 ghante baad try karo.' })
  }
})
app.use('/api/otp/send', otpLimiter)
app.use('/api/auth/forgot-password', otpLimiter)

// Upload — limit (20 per hour)
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  handler: function(req, res) {
    res.status(429).json({ error: 'Upload limit exceed! 1 ghante baad try karo.' })
  }
})
app.use('/api/upload', uploadLimiter)

// ═══════════════════════════════════════════
// 9. SLOW DOWN — DDoS Mitigation
// ═══════════════════════════════════════════
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 100, // 100 requests ke baad slow karo
  delayMs: function(used) {
    const delayAfter = 100
    return (used - delayAfter) * 100 // har extra req pe 100ms delay
  },
  maxDelayMs: 5000, // max 5 sec delay
})
app.use('/api/', speedLimiter)

// ═══════════════════════════════════════════
// 10. SECURITY HEADERS MIDDLEWARE
// ═══════════════════════════════════════════
app.use(function(req, res, next) {
  // Block suspicious User Agents
  var ua = req.headers['user-agent'] || ''
  var blockedAgents = ['sqlmap', 'nikto', 'nmap', 'masscan', 'zgrab', 'gobuster', 'dirbuster']
  if (blockedAgents.some(function(b) { return ua.toLowerCase().includes(b) })) {
    console.warn('🚨 Blocked suspicious agent:', ua, 'IP:', req.ip)
    return res.status(403).json({ error: 'Access denied' })
  }

  // Remove server info
  res.removeHeader('X-Powered-By')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')

  next()
})

// // ═══════════════════════════════════════════
// // 11. REQUEST LOGGER (suspicious activity)
// // ═══════════════════════════════════════════
// // app.use(function(req, res, next) {
// //   var suspicious = [
// //     'select', 'insert', 'update', 'delete', 'drop', 'union',
// //     'script', 'onclick', 'onload', 'eval(', '../', '..\\',
// //     'etc/passwd', 'cmd=', 'exec(',
// //   ]
// //   var url = req.url.toLowerCase()
// //   var body = JSON.stringify(req.body).toLowerCase()

//   if (suspicious.some(function(s) { return url.includes(s) || body.includes(s) })) {
//     console.warn('🚨 Suspicious request from:', req.ip, '| URL:', req.url)
//     return res.status(400).json({ error: 'Invalid request' })
//   }

//   next()
// })

// ═══════════════════════════════════════════
// 12. STATIC FILES
// ═══════════════════════════════════════════
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1d',
  etag: true,
}))

// ═══════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════
try { app.use('/api/auth',          require('./routes/auth'))          } catch(e) { console.log('auth error:', e.message) }
try { app.use('/api/listings',      require('./routes/listings'))      } catch(e) { console.log('listings error:', e.message) }
try { app.use('/api/services',      require('./routes/services'))      } catch(e) { console.log('services error:', e.message) }
try { app.use('/api/orders',        require('./routes/orders'))        } catch(e) { console.log('orders error:', e.message) }
try { app.use('/api/upload',        require('./routes/upload'))        } catch(e) { console.log('upload error:', e.message) }
try { app.use('/api/reviews',       require('./routes/reviews'))       } catch(e) { console.log('reviews error:', e.message) }
try { app.use('/api/notifications', require('./routes/notifications')) } catch(e) { console.log('notifications error:', e.message) }
try { app.use('/api/otp',           require('./routes/otp'))           } catch(e) { console.log('otp error:', e.message) }
try { app.use('/api/chat',          require('./routes/chat'))          } catch(e) { console.log('chat error:', e.message) }
try { app.use('/api/rentals',       require('./routes/rentals'))       } catch(e) { console.log('rentals error:', e.message) }
try { app.use('/api/admin',         require('./routes/admin'))         } catch(e) { console.log('admin error:', e.message) }
try { app.use('/api/phone-otp',    require('./routes/phone-otp'))    } catch(e) { console.log('phone-otp error:', e.message) }
try { app.use('/api/verification', require('./routes/verification'))  } catch(e) { console.log('verification error:', e.message) }

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

app.get('/api/health', function(req, res) {
  res.json({
    status: 'ok',
    message: 'NukkadMarket API running 🏪',
    timestamp: new Date().toISOString(),
    security: 'enabled ✅',
  })
})

// 404 handler
app.use('/api/*', function(req, res) {
  res.status(404).json({ error: 'Route not found' })
})

// Global error handler
app.use(function(err, req, res, next) {
  console.error('Error:', err.message)

  // Dont leak error details in production
  if (process.env.NODE_ENV === 'production') {
    return res.status(err.status || 500).json({ error: 'Something went wrong' })
  }
  res.status(err.status || 500).json({ error: err.message })
})

// ═══════════════════════════════════════════
// SOCKET.IO — Real-time Chat
// ═══════════════════════════════════════════
var onlineUsers = {}
var messageCount = {}  // Rate limit for chat

io.on('connection', function(socket) {
  console.log('User connected:', socket.id)

  socket.on('user_online', function(userId) {
    onlineUsers[userId] = socket.id
    socket.userId = userId
  })

  socket.on('join_room', function(roomId) {
    socket.join(roomId)
  })

  socket.on('send_message', function(data) {
    // Chat rate limit — max 30 messages per minute
    var now = Date.now()
    var key = socket.userId || socket.id
    if (!messageCount[key]) messageCount[key] = { count: 0, resetAt: now + 60000 }
    if (now > messageCount[key].resetAt) {
      messageCount[key] = { count: 0, resetAt: now + 60000 }
    }
    messageCount[key].count++
    if (messageCount[key].count > 30) {
      socket.emit('error', { message: 'Too many messages! Wait a minute.' })
      return
    }

    // Sanitize message
    var msg = (data.message || '').substring(0, 1000)
    var msgData = {
      id:         Date.now().toString(),
      senderId:   data.senderId,
      senderName: data.senderName,
      message:    msg,
      roomId:     data.roomId,
      listingId:  data.listingId,
      createdAt:  new Date().toISOString(),
    }
    io.to(data.roomId).emit('receive_message', msgData)
  })

  socket.on('disconnect', function() {
    if (socket.userId) delete onlineUsers[socket.userId]
    console.log('User disconnected:', socket.id)
  })
})

// ═══════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════
const { connectDB } = require('./db')
connectDB()

server.listen(PORT, function() {
  console.log('\n🏪 NukkadMarket Backend running on port ' + PORT)
  console.log('🔒 Security: Helmet + Rate Limit + Slow Down + XSS + NoSQL Protection')
  console.log('🛡️  DDoS Protection: ENABLED')
  console.log('💬 Socket.io: READY')
})

// Global error handler — CORS header crash ke baad bhi bhejo
app.use(function(err, req, res, next) {
  console.error('Error:', err.message)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.status(err.status || 500).json({ error: 'Something went wrong: ' + err.message })
})

// 404 handler ke liye bhi
app.use(function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.status(404).json({ error: 'Route not found' })
})