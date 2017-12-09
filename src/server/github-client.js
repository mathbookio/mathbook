"use strict"

// const CLIENT_ID = require('../config/local.json').clientId
// const CLIENT_SECRET = require('../config/local.json').clientSecret
const GitHubApi = require("github")

const gh = new GitHubApi({
  Promise: require("bluebird")
})

module.exports = gh
