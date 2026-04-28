const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://delhincr_admin:Delhi%402024@delhincr-cluster.xarvjbi.mongodb.net/delhincr?appName=delhincr-cluster'
mongoose.connect(MONGODB_URI)
  .then(function() { console.log('✅ MongoDB Connected!') })
  .catch(function(err) { console.log('❌ MongoDB Error:', err.message) })

// ─── Schemas ────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  email:        { type: String, default: '' },
  phone:        { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  isVerified:   { type: Boolean, default: false },
  avatar:       { type: String, default: '' },
  location:     { type: String, default: '' },
  area:         { type: String, default: '' },
  city:         { type: String, default: '' },
  resetOtp:       { type: String, default: null },      // ← ADD
  resetOtpExpiry: { type: Number, default: null }, 
}, { timestamps: true })

const listingSchema = new mongoose.Schema({
  userId:       { type: String, required: true },
  title:        { type: String, required: true },
  description:  { type: String, default: '' },
  price:        { type: Number, required: true },
  isNegotiable: { type: Boolean, default: false },
  category:     { type: String, required: true },
  condition:    { type: String, default: 'Good' },
  images:       [String],
  location:     { type: String, default: '' },
  area:         { type: String, default: '' },
  city:         { type: String, default: '' },
  sellerName:   { type: String, default: '' },
  sellerPhone:  { type: String, default: '' },
  isVerified:   { type: Boolean, default: false },
  views:        { type: Number, default: 0 },
  isActive:     { type: Boolean, default: true },
}, { timestamps: true })

const serviceSchema = new mongoose.Schema({
  userId:       { type: String, required: true },
  name:         { type: String, required: true },
  category:     { type: String, required: true },
  description:  { type: String, default: '' },
  priceFrom:    { type: Number, default: 0 },
  priceTo:      { type: Number, default: 0 },
  experience:   { type: Number, default: 0 },
  rating:       { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  completedJobs:{ type: Number, default: 0 },
  location:     { type: String, default: '' },
  area:         { type: String, default: '' },
  city:         { type: String, default: '' },
  isVerified:   { type: Boolean, default: false },
  phone:        { type: String, default: '' },
  providerName: { type: String, default: '' },
  avatar:       { type: String, default: '' },
}, { timestamps: true })

const orderSchema = new mongoose.Schema({
  listingId:      { type: String, required: true },
  listingTitle:   { type: String, default: '' },
  listingImage:   { type: String, default: '' },
  listingPrice:   { type: Number, default: 0 },
  listingLocation:{ type: String, default: '' },
  buyerId:        { type: String, required: true },
  buyerName:      { type: String, default: '' },
  sellerId:       { type: String, required: true },
  sellerName:     { type: String, default: '' },
  sellerPhone:    { type: String, default: '' },
  address:        { type: String, default: '' },
  paymentMethod:  { type: String, default: 'Cash on Meetup' },
  note:           { type: String, default: '' },
  status:         { type: String, default: 'pending' },
}, { timestamps: true })

const messageSchema = new mongoose.Schema({
  roomId:       { type: String, required: true },
  senderId:     { type: String, required: true },
  senderName:   { type: String, default: '' },
  receiverId:   { type: String, default: '' },
  receiverName: { type: String, default: '' },
  message:      { type: String, required: true },
  listingId:    { type: String, default: '' },
  read:         { type: Boolean, default: false },
}, { timestamps: true })

const Message = mongoose.model('Message', messageSchema)

const reviewSchema = new mongoose.Schema({
  orderId:    { type: String, required: true, unique: true },
  listingId:  { type: String, required: true },
  sellerId:   { type: String, required: true },
  buyerId:    { type: String, required: true },
  buyerName:  { type: String, default: '' },
  rating:     { type: Number, required: true },
  comment:    { type: String, default: '' },
}, { timestamps: true })

const notificationSchema = new mongoose.Schema({
  userId:   { type: String, required: true },
  title:    { type: String, default: '' },
  message:  { type: String, default: '' },
  type:     { type: String, default: 'info' },
  read:     { type: Boolean, default: false },
}, { timestamps: true })

// ─── Models ─────────────────────────────────────────────
const User         = mongoose.model('User',         userSchema)
const Listing      = mongoose.model('Listing',      listingSchema)
const Service      = mongoose.model('Service',      serviceSchema)
const Order        = mongoose.model('Order',        orderSchema)
const Review       = mongoose.model('Review',       reviewSchema)
const Notification = mongoose.model('Notification', notificationSchema)

module.exports = { User, Listing, Service, Order, Review, Notification }
module.exports = { User, Listing, Service, Order, Review, Notification, Message }