const mongoose = require('mongoose')

const ImageSchema = mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.Object,
    required: true
  },
  category: String,
  public: {
    type: Boolean, 
    required: true
  },
  sharedWith: [{}],
  description: String
})

const Image = module.exports = mongoose.model('Image', ImageSchema)