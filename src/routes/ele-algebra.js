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

// define the solve-equations route
const solveEquationsConfig = require('../ele-algebra/solving-equations/config')
const solveEquationsExercises = require('../ele-algebra/solving-equations/exercises')
const solveEquationsContent = require('../ele-algebra/solving-equations/content')
router.get('/solve-equations', function (req, res) {
  res.render('ele-algebra/solving-equations',
  { config: solveEquationsConfig, exercises: solveEquationsExercises, content: solveEquationsContent })
})

// define the solve-equations route
const substitutionConfig = require('../ele-algebra/substitution/config')
const substitutionExercises = require('../ele-algebra/substitution/exercises')
const substitutionContent = require('../ele-algebra/substitution/content')
router.get('/substitution', function (req, res) {
  res.render('ele-algebra/substitution',
  { config: substitutionConfig, exercises: substitutionExercises, content: substitutionContent })
})

// define the solve-equations route
const factoringConfig = require('../ele-algebra/factoring/config')
const factoringExercises = require('../ele-algebra/factoring/exercises')
const factoringContent = require('../ele-algebra/factoring/content')
router.get('/factoring', function (req, res) {
  res.render('ele-algebra/factoring',
  { config: factoringConfig, exercises: factoringExercises, content: factoringContent })
})

module.exports = router
