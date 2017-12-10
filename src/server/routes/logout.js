"use strict"

const _ = require("lodash")
const redisClient = require("../redis-client")
const transformError = require("../transformers/errorTransformer")
module.exports = async (req, res, next) => {
  const log = req.log
  const hashToken = _.get(req, "cookies.hashToken", null)
  res.clearCookie("hashToken")
  let deleted = false
  if (hashToken) {
    await redisClient
      .delAsync(hashToken)
      .then(() => {
        deleted = true
        _.set(req, "locals.data.authenticated", false)
      })
      .catch(err => {
        const source = "route::logout::delAsync::catch:err"
        const params = { hashToken }
        log.error(transformError(err, source, params))
      })
  }
  _.set(req, "locals.data.deleted", deleted)
  _.set(req, "locals.view", "logout")
  next()
}
