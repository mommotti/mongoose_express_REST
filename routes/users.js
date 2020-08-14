const express = require('express')
const router = express.Router()
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
dotenv.config()

router.use(express.json())

//GET ALL THE USERS ✅
router.get('/', async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (error) {
    res.status(500)
      .json({ message: error.message })
  }
})

//GET ONE USER ✅
router.get('/:id', getUser, (req, res) => {
  res.send(res.user.username)
})
//CREATE ONE USER ✅
router.post('/', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  })
  try {
    const newUser = await user.save()
    res.status(201).json(newUser)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

//DELETE ONE USER ✅
router.delete('/:id', getUser, async (req, res) => {
  try {
    await res.user.remove()
    res.json({ message: 'Deleted User' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})


//UPDATE ONE USER✅
router.patch('/:id', getUser, async (req, res) => {
  if (req.body.username != null) {
    res.user.username = req.body.username
  }
  if (req.body.email != null) {
    res.user.email = req.body.email
  }
  if (req.body.password != null) {
    res.user.password = req.body.password
  }
  try {
    const updatedUser = await res.user.save()
    res.json(updatedUser)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})


//LOGIN USER  ✅
router.post('/login', async (req, res) => {
  const getUser = await User.find({ email: req.body.email })
  if (getUser == null) {
    return res.status(404).json({ message: 'Cannot find user' })
  }
  try {
    if (await bcrypt.compare(req.body.password, getUser[0].password)) {
      //jwt
      const accessToken = jwt.sign(getUser[0].email, process.env.ACCESS_TOKEN_SECRET)
      res.json({
        message: 'Successfully logged in.',
        accessToken: accessToken
      })
      res.send('hello')
    } else {
      res.send('Not allowed.')
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})


async function getUser(req, res, next) {
  try {
    user = await User.findById(req.params.id)
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
  res.user = user
  next()
}


module.exports = router
