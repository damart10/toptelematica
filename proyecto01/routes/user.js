const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const config = require('./../config/config')

const User = require('./../models/user')

const router = express.Router()

router.post('/create', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  })

  User.addUser(newUser, (err, user) => {
    if (err) {
      res.json({
        success: false,
        message: 'Failed to register user.'
      })
    } else {
      res.json({
        succes: true,
        message: 'User registered.'
      })
    }
  })
})

router.post('/login', (req, res, next) => {
  let username = req.body.username
  let password = req.body.password

  User.getUserByUsername(username, (err, user) => {
    if(err) throw err
    if(!user){
      return res.json({
        success: false, 
        message: 'Username or password incorrect.'
      })
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err
      if(isMatch){
        const token = jwt.sign(user, config.secret, {
          expiresIn: 604800
        })

        res.json({
          success: true,
          token: 'JWT '+token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        })
      } else {
        return res.json({success: false, message: 'Username or password incorrect.'})
      }
    })
  })
})

// Profile
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  res.json({ user: req.user })
})

module.exports = router