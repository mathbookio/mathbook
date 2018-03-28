"use strict"

const redisClient = require("../../redisClient")
const transformError = require("../../transformers/errorTransformer")
module.exports = function(username, tutorialName) {
  return redisClient
    .getAsync(`${username}_${tutorialName}`)
    .then(cacheData => JSON.parse(cacheData))
    .catch(err => {
      const source = "getCachedTutorial::catch::err"
      const params = { username, tutorialName }
      return Promise.reject(transformError(err, source, params))
    })
}
