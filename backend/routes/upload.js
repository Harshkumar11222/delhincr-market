const express    = require('express')
const router     = express.Router()
const multer     = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key:    process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
})

// Multer storage — directly Cloudinary pe upload
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder:         'delhincr-market',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 600, crop: 'limit', quality: 'auto' }],
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
})

// POST /api/upload/image — single image
router.post('/image', upload.single('image'), function(req, res) {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  res.json({ url: req.file.path })
})

// POST /api/upload/images — multiple images (max 5)
router.post('/images', upload.array('images', 5), function(req, res) {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' })
  }
  var urls = req.files.map(function(f) { return f.path })
  res.json({ urls: urls })
})

module.exports = router