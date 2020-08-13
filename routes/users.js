const express = require('express')
const router = express.Router()
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
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
  console.log(getUser[0])
  console.log(req.body.password)
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


// posts under construction

// posts 
router.get('/posts', authenticateToken, async (req, res) => {
  // try {
  console.log('Hello there')
  res.send('Hi')
  // } catch (error) {
  //   res.status(500).json({ message: error.message })
  // }
  // req.user
  res.json(posts.filter(post => post.username === req.body.username))
})


// MIDDLEWARES

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  //  Unauthorized 
  if (token == null) return res.sendStatus(401)
  const user = getUser[0]
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    // Forbidden (the token is no longer valid)
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

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
