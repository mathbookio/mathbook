"use strict"
const _ = require("lodash")

module.exports = (req, res, next) => {
  _.set(req, "locals.view", "500")
  next()
}
