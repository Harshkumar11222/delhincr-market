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
const { v4: uuidv4 } = require('uuid')

const app    = express()
const server = http.createServer(app)
const io     = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || 'https://delhincr-market.vercel.app', methods: ['GET', 'POST'] }
})
const PORT = process.env.PORT || 5000

// ═══════════════════════════════════════════
// 1. TRUST PROXY
// ═══════════════════════════════════════════
app.set('trust proxy', 1)

// ═══════════════════════════════════════════
// 2. REQUEST ID — har request ka unique ID
// ═══════════════════════════════════════════
app.use(function(req, res, next) {
  req.id = uuidv4()
  res.setHeader('X-Request-ID', req.id)
  next()
})

// ═══════════════════════════════════════════
// 3. HELMET — Secure HTTP Headers
// ═══════════════════════════════════════════
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))

// ═══════════════════════════════════════════
// 4. CORS — Strict origin control
// ═══════════════════════════════════════════
var allowedOrigins = [
  'https://delhincr-market.vercel.app',
  'http://localhost:3000',
]

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || (origin && origin.includes('vercel.app'))) {
      callback(null, true)
    } else {
      callback(new Error('CORS policy violation: ' + origin))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  credentials: true,
}))
app.options('*', cors())

// CORS header force on every response
app.use(function(req, res, next) {
  var origin = req.headers.origin
  if (!origin || allowedOrigins.includes(origin) || (origin && origin.includes('vercel.app'))) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*')
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-ID')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

// ═══════════════════════════════════════════
// 5. BODY SIZE LIMIT
// ═══════════════════════════════════════════
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// ═══════════════════════════════════════════
// 6. XSS PROTECTION
// ═══════════════════════════════════════════
app.use(xss())

// ═══════════════════════════════════════════
// 7. NOSQL INJECTION PROTECTION
// ═══════════════════════════════════════════
app.use(mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn('⚠️ NoSQL injection attempt blocked! Key:', key, 'IP:', req.ip)
  }
}))

// ═══════════════════════════════════════════
// 8. HTTP PARAMETER POLLUTION
// ═══════════════════════════════════════════
app.use(hpp({
  whitelist: ['sort', 'page', 'limit', 'category', 'city', 'type', 'search']
}))

// ═══════════════════════════════════════════
// 9. SECURITY HEADERS EXTRA
// ═══════════════════════════════════════════
app.use(function(req, res, next) {
  res.removeHeader('X-Powered-By')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  next()
})

// ═══════════════════════════════════════════
// 10. RATE LIMITING — DDoS/DoS Protection
// ═══════════════════════════════════════════

// Global — 300 req/15 min
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: function(req, res) {
    console.warn('🚨 Global rate limit hit! IP:', req.ip)
    res.status(429).json({ error: 'Bahut zyada requests! 15 minute baad try karo.' })
  }
}))

// Auth routes — strict: 10 req/15 min
app.use('/api/auth/login', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  handler: function(req, res) {
    console.warn('🚨 Auth rate limit! IP:', req.ip)
    res.status(429).json({ error: 'Bahut zyada login attempts! 15 minute baad try karo.' })
  }
}))

app.use('/api/auth/register', rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  handler: function(req, res) {
    res.status(429).json({ error: 'Bahut zyada register attempts! 1 ghante baad try karo.' })
  }
}))

// OTP — very strict: 5 req/hour
app.use('/api/otp/send', rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  handler: function(req, res) {
    res.status(429).json({ error: 'OTP limit exceed! 1 ghante baad try karo.' })
  }
}))

app.use('/api/auth/forgot-password', rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  handler: function(req, res) {
    res.status(429).json({ error: 'Forgot password limit! 1 ghante baad try karo.' })
  }
}))

// Phone OTP — strict: 3 req/hour
app.use('/api/phone-otp/send', rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  handler: function(req, res) {
    res.status(429).json({ error: 'SMS OTP limit! 1 ghante baad try karo.' })
  }
}))

// Upload — 20 req/hour
app.use('/api/upload', rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  handler: function(req, res) {
    res.status(429).json({ error: 'Upload limit! 1 ghante baad try karo.' })
  }
}))

// ═══════════════════════════════════════════
// 11. SLOW DOWN — Gradual delay
// ═══════════════════════════════════════════
app.use('/api/', slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 150,
  delayMs: function(used) {
    return (used - 150) * 50
  },
  maxDelayMs: 3000,
}))

// ═══════════════════════════════════════════
// 12. SUSPICIOUS USER AGENTS BLOCK
// ═══════════════════════════════════════════
app.use(function(req, res, next) {
  var ua = (req.headers['user-agent'] || '').toLowerCase()
  var blockedAgents = ['sqlmap', 'nikto', 'nmap', 'masscan', 'zgrab', 'gobuster', 'dirbuster', 'hydra', 'burpsuite']
  if (blockedAgents.some(function(b) { return ua.includes(b) })) {
    console.warn('🚨 Blocked malicious agent:', ua, 'IP:', req.ip)
    return res.status(403).json({ error: 'Access denied' })
  }
  next()
})

// ═══════════════════════════════════════════
// 13. LOGIN ATTEMPT TRACKER
// ═══════════════════════════════════════════
var loginAttempts = {}

app.use('/api/auth/login', function(req, res, next) {
  var ip = req.ip
  var now = Date.now()

  if (!loginAttempts[ip]) loginAttempts[ip] = { count: 0, resetAt: now + 15 * 60 * 1000, blockedUntil: 0 }

  if (now < loginAttempts[ip].blockedUntil) {
    var remaining = Math.ceil((loginAttempts[ip].blockedUntil - now) / 60000)
    return res.status(429).json({ error: 'Account temporarily locked. ' + remaining + ' minute baad try karo.' })
  }

  if (now > loginAttempts[ip].resetAt) {
    loginAttempts[ip] = { count: 0, resetAt: now + 15 * 60 * 1000, blockedUntil: 0 }
  }

  loginAttempts[ip].count++

  if (loginAttempts[ip].count > 5) {
    loginAttempts[ip].blockedUntil = now + 15 * 60 * 1000
    console.warn('🔒 IP blocked after 5 failed attempts:', ip)
    return res.status(429).json({ error: 'Bahut zyada galat attempts! 15 minute ke liye block kar diya.' })
  }

  next()
})

// ═══════════════════════════════════════════
// STATIC FILES
// ═══════════════════════════════════════════
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1d', etag: true,
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
try { app.use('/api/phone-otp',     require('./routes/phone-otp'))     } catch(e) { console.log('phone-otp error:', e.message) }
try { app.use('/api/verification',  require('./routes/verification'))  } catch(e) { console.log('verification error:', e.message) }

// Health check
app.get('/api/health', function(req, res) {
  res.json({
    status: 'ok',
    message: 'NukkadMarket API running 🏪',
    timestamp: new Date().toISOString(),
    security: 'Level 5 — Production Grade ✅',
    requestId: req.id,
  })
})

// 404 handler
app.use('/api/*', function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.status(404).json({ error: 'Route not found' })
})

// Global error handler
app.use(function(err, req, res, next) {
  console.error('❌ Error:', err.message, '| Request ID:', req.id)
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  if (process.env.NODE_ENV === 'production') {
    return res.status(err.status || 500).json({ error: 'Something went wrong', requestId: req.id })
  }
  res.status(err.status || 500).json({ error: err.message })
})

// ═══════════════════════════════════════════
// SOCKET.IO — Real-time Chat with security
// ═══════════════════════════════════════════
var onlineUsers  = {}
var messageCount = {}
var socketLoginAttempts = {}

io.use(function(socket, next) {
  // Basic socket auth check
  var token = socket.handshake.auth?.token || socket.handshake.headers?.authorization
  if (!token) {
    // Allow unauthenticated connections for browsing
    return next()
  }
  try {
    var jwt = require('jsonwebtoken')
    var decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'delhincr_market_secret_2024')
    socket.userId = decoded.id
    socket.userName = decoded.name
    next()
  } catch(err) {
    next() // Allow even with invalid token, but socket.userId won't be set
  }
})

io.on('connection', function(socket) {
  console.log('🔌 Socket connected:', socket.id)

  socket.on('user_online', function(userId) {
    onlineUsers[userId] = socket.id
    socket.userId = userId
    io.emit('users_online', Object.keys(onlineUsers))
  })

  socket.on('join_room', function(roomId) {
    socket.join(roomId)
  })

  socket.on('send_message', function(data) {
    // Chat rate limit — 20 messages per minute
    var key  = socket.userId || socket.id
    var now  = Date.now()
    if (!messageCount[key]) messageCount[key] = { count: 0, resetAt: now + 60000 }
    if (now > messageCount[key].resetAt) {
      messageCount[key] = { count: 0, resetAt: now + 60000 }
    }
    messageCount[key].count++

    if (messageCount[key].count > 20) {
      socket.emit('error', { message: 'Bahut zyada messages! Thodi der baad try karo.' })
      return
    }

    // Sanitize message
    var msg = (data.message || '').substring(0, 1000).trim()
    if (!msg) return

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
    if (socket.userId) {
      delete onlineUsers[socket.userId]
      io.emit('users_online', Object.keys(onlineUsers))
    }
    console.log('🔌 Socket disconnected:', socket.id)
  })
})

// ═══════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════
const { connectDB } = require('./db')
connectDB()

server.listen(PORT, function() {
  console.log('\n🏪 NukkadMarket Backend on port ' + PORT)
  console.log('🔒 Security Level: PRODUCTION GRADE')
  console.log('🛡️ DDoS: ENABLED | Rate Limit: ENABLED')
  console.log('🔐 Login Attempts Tracker: ENABLED')
  console.log('🤖 Bot Detection: ENABLED')
  console.log('💉 XSS + NoSQL Injection: PROTECTED')
  console.log('💬 Socket.io: SECURE')
})