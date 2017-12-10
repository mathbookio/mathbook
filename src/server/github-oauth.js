"use strict"
const config = require("../../config/config")()
const CLIENT_ID = config.get("github.clientId")
const CLIENT_SECRET = config.get("github.clientSecret")
const githubOAuth = require("github-oauth")({
  githubClient: CLIENT_ID,
  githubSecret: CLIENT_SECRET,
  baseURL: "http://localhost:4000",
  loginURI: "/login/authenticate",
  callbackURI: "/login/success",
  scope: "user%20repo" // optional, default scope is set to user
})

module.exports = githubOAuth
