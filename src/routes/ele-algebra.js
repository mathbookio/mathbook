'use strict'

const express = require('express')
const router = express.Router()
const topics = require('../ele-algebra/topics')
const config = require('../ele-algebra/config')
const exercises = require('../ele-algebra/exercises')
// define the home page route
router.get('/', function (req, res) {
  res.render('ele-algebra/index', { topics })
})
// define the about route
router.get('/eval-expressions', function (req, res) {
  res.render('ele-algebra/eval-expressions', { config, exercises })
})

module.exports = router
