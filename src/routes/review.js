'use strict'

const _ = require('lodash')
const express = require('express')
const router = express.Router()

router.get('/:user/:tutorialName', (req, res) => {
  res.render('review-tutorial', { tutorialName: req.params.tutorialName, user: req.params.user })
})

module.exports = router
