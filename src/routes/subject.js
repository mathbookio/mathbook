'use strict'

const _ = require('lodash')
const express = require('express')
const router = express.Router()

router.get('/:subject', (req, res) => {
  res.render('subject-catalog', { subject: req.params.subject })
})

module.exports = router
