'use strict'

const express = require('express')
const router = express.Router()

// define the home page route
const topics = require('../ele-algebra/topics')
router.get('/', function (req, res) {
  res.render('ele-algebra/index', { topics })
})

// define the eval-expressions route
const evalExpressionsConfig = require('../ele-algebra/eval-expressions/config')
const evalExpressionsExercises = require('../ele-algebra/eval-expressions/exercises')
const evalExpressionsContent = require('../ele-algebra/eval-expressions/content')
router.get('/eval-expressions', function (req, res) {
  res.render('ele-algebra/eval-expressions',
  { config: evalExpressionsConfig, exercises: evalExpressionsExercises, content: evalExpressionsContent })
})

// define the iso-variables route
const isoVariablesConfig = require('../ele-algebra/iso-variables/config')
const isoVariablesExercises = require('../ele-algebra/iso-variables/exercises')
const isoVariablesContent = require('../ele-algebra/iso-variables/content')
router.get('/iso-variables', function (req, res) {
  res.render('ele-algebra/iso-variables',
  { config: isoVariablesConfig, exercises: isoVariablesExercises, content: isoVariablesContent })
})

module.exports = router
