const mongoose = require('mongoose')

const requiredString = {
  type: String,
  required: true
}

const userSchema = new mongoose.Schema({
  username: requiredString,
  email: requiredString,
  password: requiredString
})

module.exports = mongoose.model('user', userSchema)