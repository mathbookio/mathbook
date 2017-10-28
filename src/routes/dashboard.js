'use strict'

const _ = require('lodash')
const express = require('express')
const githubOAuth = require('../github-oauth')
const router = express.Router()

// define the home page route
router.get('/', function (req, res) {
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
