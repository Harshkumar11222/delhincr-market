const express = require('express')
const cors    = require('cors')
const path    = require('path')
const http    = require('http')
const { Server } = require('socket.io')

const app    = express()
const server = http.createServer(app)
const io     = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
})

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

app.get('/api/health', function(req, res) {
  res.json({ status: 'ok', message: 'DelhiNCR Market API running 🚀' })
})

// Socket.io — Real-time Chat
var onlineUsers = {}

io.on('connection', function(socket) {
  console.log('User connected:', socket.id)

  // User online mark karo
  socket.on('user_online', function(userId) {
    onlineUsers[userId] = socket.id
    socket.userId = userId
  })

  // Room join karo (listingId + buyerId = unique room)
  socket.on('join_room', function(roomId) {
    socket.join(roomId)
    console.log('Joined room:', roomId)
  })

  // Message bhejo
  socket.on('send_message', function(data) {
    // data: { roomId, senderId, senderName, message, listingId }
    var msgData = {
      id:         Date.now().toString(),
      senderId:   data.senderId,
      senderName: data.senderName,
      message:    data.message,
      roomId:     data.roomId,
      listingId:  data.listingId,
      createdAt:  new Date().toISOString(),
    }
    // Room ke sab logon ko message bhejo
    io.to(data.roomId).emit('receive_message', msgData)
  })

  socket.on('disconnect', function() {
    if (socket.userId) {
      delete onlineUsers[socket.userId]
    }
    console.log('User disconnected:', socket.id)
  })
})

server.listen(PORT, function() {
  console.log('\n🚀 DelhiNCR Market Backend running on port ' + PORT)
  console.log('💬 Socket.io Chat ready!')
})