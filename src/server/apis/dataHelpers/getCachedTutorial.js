"use strict"

const redisClient = require("../../redisClient")
const transformError = require("../../transformers/errorTransformer")
module.exports = function(hashToken, tutorialName, log) {
  return redisClient
    .getAsync(hashToken)
    .then(data => JSON.parse(data).username)
    .then(username => redisClient.getAsync(`${username}_${tutorialName}`))
    .catch(err => {
      const source = "getCachedTutorial::catch::err"
      const params = { hashToken, tutorialName }
      transformError(err, source, params)
      log.error({ err, details: err.details })
      return Promise.reject(transformError(err, source, params))
    })
}
