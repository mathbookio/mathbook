'use strict'

const express = require('express')
const router = express.Router()
const githubOAuth = require('../github-oauth')

router.get('/', (req, res) => {
  res.render('login')
})

router.get('/authenticate', (req, res) => {
  githubOAuth.login(req, res)
})

module.exports = router
