"use strict"

const redisClient = require("../../redisClient")
const transformError = require("../../transformers/errorTransformer")
const Promise = require("bluebird")

module.exports = async function(username, tutorialName) {
  const id = `${username}_${tutorialName}`
  return redisClient.delAsync(id).catch(err => {
    const source = "deleteCachedTutorial::catch:err"
    const params = { username, tutorialName }
    return Promise.reject(transformError(err, source, params))
  })
}
