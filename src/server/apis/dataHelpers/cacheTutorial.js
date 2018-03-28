"use strict"

const Promise = require("bluebird")
const _ = require("lodash")
const errors = require("../../errors")
const transformError = require("../../transformers/errorTransformer")
const redisClient = require("../../redisClient")

module.exports = async function(data) {
  const configData = _.get(data, "config", {})
  const contentData = _.get(data, "content", [])
  const contentWipData = _.get(data, "contentWip", {})
  const exerciseData = _.get(data, "exercises", [])
  const exerciseWipData = _.get(data, "exerciseWip", {})
  const tutorialName = _.get(data, "tutorialName", null)
  const hashToken = _.get(data, "hashToken", null)
  if (hashToken && tutorialName) {
    try {
      const username = await redisClient.getAsync(hashToken).then(result => JSON.parse(result).username)
      const id = `${username}_${tutorialName}`
      await redisClient.setAsync(
        id,
        JSON.stringify({
          config: configData,
          content: contentData,
          contentWip: contentWipData,
          exercises: exerciseData,
          exerciseWip: exerciseWipData
        })
      )
      return Promise.resolve()
    } catch (err) {
      const source = "cacheTutorial::catch::err"
      const params = { hashToken, tutorialName, data }
      return Promise.reject(transformError(err, source, params))
    }
  } else {
    const source = "cacheTutorial::err"
    const params = { hashToken, tutorialName }
    const err = new errors.BadRequestError("hashToken and tutorialName are required")
    return Promise.reject(transformError(err, source, params))
  }
}
