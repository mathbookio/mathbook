'use strict'

const express = require('express')
const router = express.Router()

// define the home page route
router.get('/', function (req, res) {
  res.render('ele-algebra/index')
})
// define the about route
router.get('/about', function (req, res) {
  res.send('About birds')
})

module.exports = router
