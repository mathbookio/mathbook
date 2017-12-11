"use strict"
const config = require("../../config/config")()
const clientId = config.get("github.clientId")
const clientSecret = config.get("github.clientSecret")
const env = config.get("env")
const domain = config.get("bin.domain")
const port = config.get("bin.port")
const protocol = config.get("bin.protocol")

let baseUrl = `${protocol}://${domain}:${port}`
if (env === "production") {
  baseUrl = `${protocol}://${domain}`
}

const githubOAuth = require("github-oauth")({
  githubClient: clientId,
  githubSecret: clientSecret,
  baseURL: baseUrl,
  loginURI: "/login/authenticate",
  callbackURI: "/login/success",
  scope: "user%20repo" // optional, default scope is set to user
})

module.exports = githubOAuth
