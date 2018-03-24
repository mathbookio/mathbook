"use strict"

const { CACHE_TUTORIAL_TIME_LIMIT } = require("../../../config/constants.json")
const _ = require("lodash")
const errors = require("../errors")
const transformError = require("../transformers/errorTransformer")
const redisClient = require("../redis-client")

module.exports = async function(req, res) {
  const log = req.log
  const data = _.get(req, "body.data", {})
  const configData = _.get(data, "config", {})
  const contentData = _.get(data, "content", [])
  const exerciseData = _.get(data, "exercises", [])
  const branchName = _.get(data, "tutorialName", null)
  const hashToken = _.get(req, "cookies.hashToken", null)
  if (hashToken && branchName) {
    try {
      const id = hashToken + "_" + branchName
      await redisClient.setAsync(
        id,
        JSON.stringify({
          config: configData,
          content: contentData,
          exercises: exerciseData
        }),
        "EX",
        CACHE_TUTORIAL_TIME_LIMIT
      )
      res.sendStatus(204)
    } catch (err) {
      const source = "cacheTutorial::catch::err"
      const params = { hashToken, branchName, data }
      const error = transformError(err, source, params)
      log.error({ err: error, details: error.details }, `Unable to cache tutorial state because: "${err.message}"`)
      const internalServerError = new errors.InternalServerError("Unable to cache tutorial.")
      res.status(internalServerError.status).send(internalServerError)
    }
  } else {
    const source = "cacheTutorial::err"
    const params = { hashToken, branchName }
    const err = transformError({}, source, params)
    log.error({ err, details: err.details }, "Unable to cache tutorial state.")
    const badRequestError = new errors.BadRequestError("hashToken and tutorialName are required")
    res.status(badRequestError.status).send(badRequestError)
  }
}
