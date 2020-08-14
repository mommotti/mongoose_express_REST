const express = require('express')
const router = express.Router()
router.use(express.json())
const Post = require('../models/postModel')
const jwt = require('jsonwebtoken')



//GET USER'S POSTS
router.get('/', authenticateToken, async (req, res) => {
  const posts = await Post.find()
  res.json(posts)
})


//POST A POST
router.post('/', authenticateToken, async (req, res) => {
  const post = new Post({
    username: req.body.username,
    title: req.body.title,
    text: req.body.text,
    img: req.body.img
  })
  try {
    const newPost = await post.save()
    res.status(201).json(newPost)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  //  Unauthorized 
  if (token == null) return res.sendStatus(401)
  const user = req.body.password
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    // 403 Forbidden (the token is no longer valid)
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}
module.exports = router
