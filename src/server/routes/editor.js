"use strict"
const _ = require("lodash")

// define the home page route
module.exports = function(req, res, next) {
  _.set(req, "locals.data.tutorialName", req.params.tutorialName)
  _.set(req, "locals.view", "editor")
  next()
}
