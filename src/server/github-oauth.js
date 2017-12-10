"use strict"
const config = require("../../config/config")()
const CLIENT_ID = config.get("github.clientId")
const CLIENT_SECRET = config.get("github.clientSecret")
const host = config.get("bin.host")
const port = config.get("bin.port")
const githubOAuth = require("github-oauth")({
  githubClient: CLIENT_ID,
  githubSecret: CLIENT_SECRET,
  baseURL: `http://${host}:${port}`,
  loginURI: "/login/authenticate",
  callbackURI: "/login/success",
  scope: "user%20repo" // optional, default scope is set to user
})

module.exports = githubOAuth
