"use strict"

const _ = require("lodash")
const redisClient = require("../redis-client")
const transformError = require("../transformers/errorTransformer")
const errors = require("../errors")
module.exports = () => {
  return async (req, res, next) => {
    const log = req.log
    const hashToken = _.get(req, "cookies.hashToken", null)
    let isAuthenticated = false
    let username = ""
    if (hashToken) {
      await redisClient
        .getAsync(hashToken)
        .then(result => {
          if (result) {
            username = JSON.parse(result).username
            isAuthenticated = true
          }
        })
        .catch(err => {
          const source = "middleware::authentication::redisClient::getAsync::catch:err"
          const params = { hashToken }
          const error = transformError(err, source, params)
          log.error({ err: error, details: error.details }, "Authentication Middleware broke down.")
          const internalServerError = new errors.InternalServerError("Something broke in authentication Middleware")
          res.status(internalServerError.status).send(internalServerError)
        })
    }
    _.set(req, "locals.data.username", username)
    _.set(req, "locals.data.authenticated", isAuthenticated)
    if (!res.headersSent) {
      next()
    }
  }
}
