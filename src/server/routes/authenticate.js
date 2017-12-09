"use strict"
const _ = require("lodash")
const express = require("express")
const router = express.Router()
const githubOAuth = require("../github-oauth")
const sha256 = require("sha256")
const redisClient = require("../redis-client")
const moment = require("moment")
const constants = require("../../../config/constants.json")

router.get("/", (req, res) => {
  res.render("login")
})

router.get("/authenticate", (req, res) => {
  githubOAuth.login(req, res)
})

router.get("/success", async (req, res) => {
  githubOAuth.callback(req, res, (err, result) => {
    if (err) {
      res.send(err)
      return
    }
    const accessToken = _.get(result, "access_token")
    setupSession(res, accessToken)
    res.render("dashboard")
  })
})

function setupSession(res, accessToken) {
  const sessionTimeLimit = constants.SESSION_TIME_LIMIT
  const expiresOn = moment.utc().unix() + sessionTimeLimit // expiresOn is in seconds
  if (accessToken) {
    const hash = sha256(accessToken)
    redisClient.setAsync(hash, JSON.stringify({ authToken: accessToken, expiresOn }), "EX", sessionTimeLimit)
    res.cookie("hashToken", hash)
  }
}

module.exports = router
