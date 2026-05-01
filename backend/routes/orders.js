const express    = require('express')
const router     = express.Router()
const { Order, Listing, User } = require('../db')
const auth       = require('../middleware/auth')
const nodemailer = require('nodemailer')

var notifRouter = null
try { notifRouter = require('./notifications') } catch(e) {}

function sendNotification(userId, title, message, type) {
  try {
    if (notifRouter && notifRouter.createNotification) {
      notifRouter.createNotification(userId, title, message, type)
    }
  } catch(e) {}
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  }
})

async function sendEmail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: '"DelhiNCR Market" <' + process.env.GMAIL_USER + '>',
      to: to,
      subject: subject,
      html: html,
    })
    console.log('Email sent to:', to)
  } catch(err) {
    console.log('Email error:', err.message)
  }
}

router.post('/', auth, async function(req, res) {
  try {
    var listingId     = req.body.listingId
    var address       = req.body.address
    var paymentMethod = req.body.paymentMethod
    var note          = req.body.note

    if (!listingId || !address) return res.status(400).json({ error: 'listingId and address required' })

    var listing = await Listing.findById(listingId)
    if (!listing || !listing.isActive) return res.status(404).json({ error: 'Listing not found' })
    if (listing.userId.toString() === req.user.id) return res.status(400).json({ error: 'Apni khud ki listing nahi khareed sakte' })

    var order = await Order.create({
      listingId:       listingId,
      listingTitle:    listing.title,
      listingImage:    listing.images && listing.images[0] ? listing.images[0] : '',
      listingPrice:    listing.price,
      listingLocation: listing.location,
      buyerId:         req.user.id,
      buyerName:       req.user.name,
      sellerId:        listing.userId,
      sellerName:      listing.sellerName,
      sellerPhone:     listing.sellerPhone,
      address:         address,
      paymentMethod:   paymentMethod || 'Cash on Meetup',
      note:            note || '',
      status:          'pending',
    })

    // Seller ko email bhejo
    var sellerUser = await User.findById(listing.userId)
    if (sellerUser && sellerUser.email) {
      sendEmail(
        sellerUser.email,
        'Naya Order Aaya! 🛒 — DelhiNCR Market',
        '<div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:20px;">' +
        '<div style="background:linear-gradient(135deg,#1E3A8A,#2563EB);padding:20px;border-radius:12px;text-align:center;margin-bottom:20px;">' +
        '<h1 style="color:white;margin:0;">DelhiNCR Market</h1></div>' +
        '<h2 style="color:#111827;">🛒 Naya Order Aaya!</h2>' +
        '<p style="color:#6B7280;">Aapki listing pe ek buyer ne order kiya hai.</p>' +
        '<div style="background:#F9FAFB;border-radius:12px;padding:16px;margin:16px 0;">' +
        '<p><strong>Item:</strong> ' + listing.title + '</p>' +
        '<p><strong>Price:</strong> ₹' + listing.price.toLocaleString('en-IN') + '</p>' +
        '<p><strong>Buyer:</strong> ' + req.user.name + '</p>' +
        '<p><strong>Payment:</strong> ' + (paymentMethod || 'Cash on Meetup') + '</p>' +
        '<p><strong>Address:</strong> ' + address + '</p></div>' +
        '<a href="https://delhincr-market.vercel.app/orders" style="display:block;background:#FF6B35;color:white;text-align:center;padding:14px;border-radius:99px;text-decoration:none;font-weight:700;">📦 Order Dekho</a>' +
        '</div>'
      )
    }

    sendNotification(listing.userId.toString(), 'Naya Order! 🛒', req.user.name + ' ne "' + listing.title + '" order kiya', 'order')
    res.status(201).json(order)
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/my', auth, async function(req, res) {
  try {
    var bought = await Order.find({ buyerId:  req.user.id }).sort({ createdAt: -1 })
    var sold   = await Order.find({ sellerId: req.user.id }).sort({ createdAt: -1 })
    res.json({ bought, sold })
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id', auth, async function(req, res) {
  try {
    var order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ error: 'Order not found' })
    if (order.buyerId.toString() !== req.user.id && order.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' })
    }
    res.json(order)
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

router.patch('/:id/status', auth, async function(req, res) {
  try {
    var status  = req.body.status
    var allowed = ['pending', 'confirmed', 'completed', 'cancelled']
    if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' })

    var order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ error: 'Order not found' })
    if (order.buyerId.toString() !== req.user.id && order.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' })
    }

    order.status = status
    await order.save()

    // Buyer ko email bhejo
    var buyerUser = await User.findById(order.buyerId)
    if (buyerUser && buyerUser.email) {
      var statusMessages = {
        confirmed: { emoji: '✅', text: 'Confirm Ho Gaya!' },
        completed: { emoji: '🎉', text: 'Complete Ho Gaya!' },
        cancelled: { emoji: '❌', text: 'Cancel Ho Gaya' },
      }
      var statusInfo = statusMessages[status]
      if (statusInfo) {
        sendEmail(
          buyerUser.email,
          'Order ' + statusInfo.text + ' — DelhiNCR Market',
          '<div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:20px;">' +
          '<div style="background:linear-gradient(135deg,#1E3A8A,#2563EB);padding:20px;border-radius:12px;text-align:center;margin-bottom:20px;">' +
          '<h1 style="color:white;margin:0;">DelhiNCR Market</h1></div>' +
          '<h2 style="color:#111827;">' + statusInfo.emoji + ' Order ' + statusInfo.text + '</h2>' +
          '<div style="background:#F9FAFB;border-radius:12px;padding:16px;margin:16px 0;">' +
          '<p><strong>Item:</strong> ' + order.listingTitle + '</p>' +
          '<p><strong>Amount:</strong> ₹' + (order.listingPrice || 0).toLocaleString('en-IN') + '</p>' +
          '<p><strong>Status:</strong> ' + statusInfo.emoji + ' ' + status.toUpperCase() + '</p></div>' +
          '<a href="https://delhincr-market.vercel.app/orders" style="display:block;background:#FF6B35;color:white;text-align:center;padding:14px;border-radius:99px;text-decoration:none;font-weight:700;">📦 Order Dekho</a>' +
          '</div>'
        )
      }
    }

    sendNotification(order.buyerId.toString(), 'Order Update 📦', 'Aapka order "' + order.listingTitle + '" ' + status + ' ho gaya', 'status')
    res.json(order)
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router