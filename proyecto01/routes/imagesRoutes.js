const express = require('express')
const passport = require('passport')

const Image = require ('../models/imageModel')
const router = express.Router()

// Create image
router.post('/', (req, res) => {
  let newImage = new Image(req.body)
  newImage.save((err, user) => {
    if (err) {
      console.log(err)
      res.json({
        ok: false,
        message: 'Failed to upload the image.'
      })
    } else {
      res.json({
        ok: true,
        message: 'Image uploaded.'
      })
    }
  })
})

// Get all images
router.get('/', (req, res) => {
  Image.find((err, images) => {
    if (err) {
      console.log(err)
      res.json({
        ok: false,
        message: 'Failed to retrieve the images.'
      })
    } else {
      res.json({
        ok: true,
        images: images
      })
    }
  })
})

// Get single image
router.get('/:id', (req, res) => {
  Image.findById(req.params.id, (err, image) => {
    if (err) {
      console.log(err)
      res.json({
        ok: false,
        message: 'Image doesn\'t exists'
      })
    } else {
      res.json({
        ok: true,
        image: image
      })
    }
  })
})

// Update image
router.put('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Image.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, (req, res) => {
    if (err) {
      console.log(err)
      res.json({
        ok: false,
        message: 'There was an error trying to update.'
      })
    } else {
      res.json({
        ok: true,
        message: 'Image updated successfully',
        image: image
      })
    }
  })
})

// Delete image
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Image.findByIdAndRemove({_id: req.params.id}, (err, image) => {
    if (err) {
      console.log(err)
      res.json({
        ok: false,
        message: 'There was an error trying to delete the image.'
      })
    } else {
      res.json({
        ok: true,
        message: 'Image deleted successfully'
      })
    }
  })
})

module.exports = router;