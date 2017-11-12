'use strict'

const _ = require('lodash')
const express = require('express')
const router = express.Router()
const githubOAuth = require('../github-oauth')

router.get('/', (req, res) => {
  res.render('login')
})

router.get('/authenticate', (req, res) => {
  githubOAuth.login(req, res)
})

router.get('/success', (req, res) => {
  githubOAuth.callback(req, res, (err, result) => {
    if (err) {
      console.log('err github o auth callback', err)
      res.send(err)
      return
    }
    const accessToken = _.get(result, 'access_token')
    if (accessToken && req.cookies.accessToken !== accessToken) {
      console.log('accessToken', accessToken)
      res.cookie('accessToken', accessToken)
    }
    res.render('dashboard')
  })
})

module.exports = router
