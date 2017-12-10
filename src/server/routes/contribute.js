"use strict"
const _ = require("lodash")
const express = require("express")
const router = express.Router()

// define the home page route
router.get("/", function(req, res, next) {
  _.set(req, "locals.view", "contribute-components/overview")
  next()
})

router.get("/create-tutorial", function(req, res, next) {
  _.set(req, "locals.view", "contribute-components/create-tutorial")
  next()
})
router.get("/review-tutorial", function(req, res, next) {
  _.set(req, "locals.view", "contribute-components/review-tutorial")
  next()
})

module.exports = router
