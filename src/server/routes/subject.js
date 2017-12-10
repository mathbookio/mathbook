"use strict"

const _ = require("lodash")

module.exports = (req, res, next) => {
  _.set(req, "locals.data.subject", req.params.subject)
  _.set(req, "locals.view", "subject-catalog")
  next()
}
