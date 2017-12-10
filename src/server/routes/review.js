"use strict"

const _ = require("lodash")
module.exports = (req, res, next) => {
  _.set(req, "locals.data.tutorialName", req.params.tutorialName)
  _.set(req, "locals.data.user", req.params.user)
  _.set(req, "locals.view", "review-tutorial")
  next()
}
