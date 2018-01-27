"use strict"
const config = require("../../config/config")()
const clientId = config.get("github.clientId")
const clientSecret = config.get("github.clientSecret")
const env = config.get("env")
const domain = config.get("bin.domain")
const proxyPort = config.get("bin.proxyPort")
const protocol = config.get("bin.protocol")
const log = require("./logger")

let baseUrl = `${protocol}://${domain}:${proxyPort}`
if (env === "production") {
  baseUrl = `${protocol}://${domain}`
}

const githubOAuth = require("github-oauth")({
  githubClient: clientId,
  githubSecret: clientSecret,
  baseURL: baseUrl,
  loginURI: "/login/authenticate",
  callbackURI: "/login/success",
  scope: "public_repo"
})
githubOAuth.on("error", function(err) {
  log.error(err, "there was a login error")
})
module.exports = githubOAuth
