const express = require('express')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')
const router = express.Router()

// Create user
router.post('/', (req, res) => {
  let newUser = new User(req.body)
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err

      newUser.password = hash

      newUser.save((err, user) => {
        if (err) {
          res.json({
            ok: false,
            message: 'Failed to register user.'
          });
        } else {
          res.json({
            ok: true,
            message: 'User registered.'
          });
        }
      })
    })
  })
})

// Get all users
router.get('/', (req, res) => {
  User.find((err, users) => {
    if (err) {
      console.log(err)
      res.json({
        ok: false,
        message: 'Failed to retrieving the users.'
      })
    } else {
      res.json({
        ok: true,
        users: users
      })
    }
  })
})

// Login
router.post('/login', (req, res) => {
  let username = req.body.username
  let password = req.body.password

  const query = { username: username }
  User.findOne(query, (err, user) => {
    if (err) throw err
    if (!user) {
      return res.json({
        ok: false,
        message: 'Username or password incorrect.'
      })
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) throw err
      if (isMatch) {
        const token = jwt.sign(user, config.secret, {
          expiresIn: 604800
        })

        res.json({
          ok: true,
          token: 'JWT ' + token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            description: user.description
          }
        })
      } else {
        return res.json({
          ok: false,
          message: 'Username or password incorrect.'
        })
      }
    })
  })
})

// Authorize 
router.get('/login', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ user: req.user })
})

// Get user
router.get('/:id', (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      console.log(err)
      res.json({
        ok: false,
        message: 'User doesn\'t exists.'
      })
    } else {
      res.json({
        ok: true,
        user: user
      })
    }
  })
})

// Update user
router.put('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, (err, user) => {
    if (err) {
      console.log(err)
      res.json({
        ok: false,
        message: 'There was an error trying to update.' 
      })
    } else {
      res.json({
        ok: true,
        message: 'User updated successfully',
        user: user
      })
    }
  })
})

// Delete user
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findByIdAndRemove({_id: req.params.id}, (err, user) => {
    if (err){
      console.log(err)
      res.json({
        ok: false,
        message: 'There was a error trying to delete the user.'
      })
    } else {
      res.json({ 
        ok: true,
        message: 'User deleted successfully' 
      })
    }
  })
})

module.exports = router;