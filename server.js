const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/users', {
  useNewUrlParser: true, useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('🎉 Connected to the database 🎉'))

app.get('/', (req, res) => {
  res.json({
    'message': 'Welcome to our app'
  })
})
app.use(express.json())

// users router
const users = require('./routes/users')
app.use('/api/users', users)


const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`🌱 Server running on port ${PORT} 🌱`))
