"use strict"

const Promise = require("bluebird")
const _ = require("lodash")
const errors = require("../../errors")
const transformError = require("../../transformers/errorTransformer")
const redisClient = require("../../redis-client")

module.exports = async function(data, log) {
  const configData = _.get(data, "config", {})
  const contentData = _.get(data, "content", [])
  const contentWipData = _.get(data, "contentWip", {})
  const exerciseData = _.get(data, "exercises", [])
  const branchName = _.get(data, "tutorialName", null)
  const hashToken = _.get(data, "hashToken", null)
  if (hashToken && branchName) {
    try {
      const username = await redisClient.getAsync(hashToken).then(result => JSON.parse(result).username)
      const id = `${username}_${branchName}`
      await redisClient.setAsync(
        id,
        JSON.stringify({
          config: configData,
          content: contentData,
          contentWip: contentWipData,
          exercises: exerciseData
        })
      )
      return Promise.resolve()
    } catch (err) {
      const source = "cacheTutorial::catch::err"
      const params = { hashToken, branchName, data }
      const error = transformError(err, source, params)
      log.error({ err: error, details: error.details }, `Unable to cache tutorial state because: "${err.message}"`)
      const internalServerError = new errors.InternalServerError("Unable to cache tutorial.")
      return Promise.reject(internalServerError)
    }
  } else {
    const source = "cacheTutorial::err"
    const params = { hashToken, branchName }
    const err = transformError({}, source, params)
    log.error({ err, details: err.details }, "Unable to cache tutorial state.")
    const badRequestError = new errors.BadRequestError("hashToken and tutorialName are required")
    return Promise.reject(badRequestError)
  }
}
