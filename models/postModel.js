const mongoose = require('mongoose')

const requiredString = {
  type: String,
  required: true
}

const postSchema = new mongoose.Schema({
  username: requiredString,
  title: requiredString,
  text: {
    type: String
  },
  img: {
    type: String
  }
})

module.exports = mongoose.model('post', postSchema)