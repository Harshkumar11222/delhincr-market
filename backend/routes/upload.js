const express = require('express')
const router  = express.Router()
const multer  = require('multer')
const path    = require('path')
const { v4: uuidv4 } = require('uuid')

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: function(req, file, cb) {
    var ext = path.extname(file.originalname)
    cb(null, uuidv4() + ext)
  }
})

const fileFilter = function(req, file, cb) {
  var allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (allowed.indexOf(file.mimetype) !== -1) {
    cb(null, true)
  } else {
    cb(new Error('Only JPG/PNG/WEBP allowed'), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
})

// POST /api/upload/image
router.post('/image', upload.single('image'), function(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }
  var imageUrl = 'http://localhost:5000/uploads/' + req.file.filename
  res.json({ url: imageUrl, filename: req.file.filename })
})

// POST /api/upload/images (multiple — max 5)
router.post('/images', upload.array('images', 5), function(req, res) {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' })
  }
  var urls = req.files.map(function(f) {
    return 'http://localhost:5000/uploads/' + f.filename
  })
  res.json({ urls: urls })
})

module.exports = router