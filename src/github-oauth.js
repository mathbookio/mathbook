'use strict'
const CLIENT_ID = require('../config/local.json').clientId
const CLIENT_SECRET = require('../config/local.json').clientSecret
const githubOAuth = require('github-oauth')({
  githubClient: CLIENT_ID,
  githubSecret: CLIENT_SECRET,
  baseURL: 'http://localhost:4000',
  loginURI: '/login/authenticate',
  callbackURI: '/dashboard',
  scope: 'user%20repo' // optional, default scope is set to user
})

module.exports = githubOAuth
