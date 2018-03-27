"use strict"
const _ = require("lodash")
const express = require("express")
const router = express.Router()
const githubOAuth = require("../githubOAuth")
const sha256 = require("sha256")
const redisClient = require("../redisClient")
const moment = require("moment")
const constants = require("../../../config/constants.json")
const transformError = require("../transformers/errorTransformer")
const errors = require("../errors")
const github = require("../githubClient")

router.get("/", (req, res, next) => {
  _.set(req, "locals.view", "login")
  next()
})

router.get("/authenticate", (req, res) => {
  githubOAuth.login(req, res)
})

router.get("/success", async (req, res, next) => {
  const log = req.log
  githubOAuth.callback(req, res, async (err, result) => {
    if (err) {
      const source = "route::authenticate::/success::githubOAuth::callback::err"
      const params = {}
      const error = transformError(err, source, params)
      log.error({ err: error, details: err.details }, "Something broke in the githubOAuth callback method")
      const internalServerError = new errors.InternalServerError(
        "Something broke during post successful login process."
      )
      res.status(internalServerError.status).send(internalServerError)
      return
    }
    const accessToken = _.get(result, "access_token", null)
    if (accessToken) {
      authenticateGithubClient(accessToken)
      const username = await getUsername().catch(err => {
        log.error({ err, details: err.details }, "Something broke while trying to get username")
        const error = new errors.InternalServerError("Something broke during post successful login process.")
        res.status(error.status).send(error)
      })
      await setupSession(res, accessToken, username)
      _.set(req, "locals.data.username", username)
      _.set(req, "locals.data.authenticated", true)
    }
    _.set(req, "locals.view", "dashboard")
    if (!res.headersSent) {
      next()
    }
  })
})

async function setupSession(res, accessToken, username) {
  const sessionTimeLimit = constants.SESSION_TIME_LIMIT
  const expiresOn = moment.utc().unix() + sessionTimeLimit // expiresOn is in seconds
  if (accessToken && username) {
    const hash = sha256(accessToken)
    await redisClient.setAsync(
      hash,
      JSON.stringify({
        authToken: accessToken,
        expiresOn,
        username
      }),
      "EX",
      sessionTimeLimit
    )
    res.cookie("hashToken", hash)
  }
}

function authenticateGithubClient(authToken) {
  github.authenticate({
    type: "oauth",
    token: authToken
  })
}
function getUsername() {
  return github.users
    .get({})
    .then(result => result.data.login)
    .catch(err => {
      const source = "route::authenticate::getUsername::catch::err"
      const params = {}
      return Promise.reject(transformError(err, source, params))
    })
}

module.exports = router
