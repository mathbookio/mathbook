"use strict"

const GitHubApi = require("github")

const gh = new GitHubApi({
  Promise: require("bluebird")
})

module.exports = gh
