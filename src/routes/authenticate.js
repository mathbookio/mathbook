"use strict"
const _ = require("lodash")
const express = require("express")
const router = express.Router()
const githubOAuth = require("../github-oauth")
const sha256 = require("sha256")
const redisClient = require("../redis-client")
const moment = require("moment")

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
    // expiresOn is in seconds
    const expiresOn = moment.utc().unix() + 86400
    if (accessToken) {
      const hash = sha256(accessToken)
      redisClient.setAsync(hash, JSON.stringify({ authToken: accessToken, expiresOn }), "EX", 86400)
      res.cookie("hashToken", hash)
    }
    res.render("dashboard")
  })
})

module.exports = router
