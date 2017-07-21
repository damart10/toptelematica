const express = require('express')
const User = require('./../models/user')

const router = express.Router()

router.post('/register', (req, res, next) => {
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
        message: 'Failed to register user'
      })
    } else {
      res.json({
        succes: true,
        message: 'User registered'
      })
    }
  })
})

router.post('/login', (req, res, next) => {
  let username = req.body.username
  let password = req.body.password

  User.getUserByUsername(username, (err, user) => {
    if(err) throw err
    
    if(!user) {
      return res.json({succes: false, message: 'User not found'})
    }

    if(user.password !== password) {
      return res.json({succes: false, message: 'Username or password incorrect'})
    } else {
      return res.json({
        succes: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username
        }
      })
    }
  })
})

module.exports = router