const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const passport = require('passport')

const users = require('./routes/userRoutes')
const images = require('./routes/imagesRoutes')
const config = require('./config/config')

const PORT = process.env.PORT || 3000;
const app = express()

console.log(process.env.NODE_ENV)

mongoose.connect(config.database, config.options)

mongoose.connection.on('connected', () => {
  console.log('Connected to database', config.database)
})

mongoose.connection.on('error', (err) => {
  console.log('Something went wrong:', err)
})

// Middleware para request externas
app.use(cors())
// Middleware para parsear body de request
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport)

// Redirección por ruta a controlador
app.use('/api/users', users)
app.use('/api/images', images)

// Ruta inicial
app.get('/', (req, res) => {
  res.send("Invalid endpoint.")
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log("Server started on port:", PORT)
})