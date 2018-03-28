"use strict"

const Promise = require("bluebird")
const transformError = require("../../transformers/errorTransformer")
const redisClient = require("../../redisClient")

module.exports = function(hashToken) {
  return redisClient
    .getAsync(hashToken)
    .then(cacheData => JSON.parse(cacheData).username)
    .catch(err => {
      const source = "getUsername::catch::err"
      const params = { hashToken }
      return Promise.reject(transformError(err, source, params))
    })
}
