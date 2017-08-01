if (process.env.NODE_ENV !== 'production') {
  config = {
    database: 'mongodb://localhost:27017/dmarti25',
    options: {},
    secret: 'thisisasecret'
  }
} else {
  config = {
    database: 'mongodb://heroku_dh70zlrr:7n3gl5mfb1aqvmaians7t761hs@ds027519.mlab.com:27519/heroku_dh70zlrr',
    options: { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                  replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } },
    secret: 'thisisasecret'
  }
}

module.exports = config