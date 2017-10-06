if (process.env.NODE_ENV !== 'production') {
  config = {
    database: 'mongodb://localhost:27017/dmarti25',
    options: {},
    secret: 'thisisasecret'
  }
} else {
  config = {
    database: process.env.MONGODB_URI,
    options: { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                  replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } },
    secret: 'thisisasecret'
  }
}

module.exports = config