"use strict"
const express = require("express")
const router = express.Router()

// define the home page route
router.get("/", function(req, res) {
  res.render("contribute-components/overview")
})

router.get("/create-tutorial", function(req, res) {
  res.render("contribute-components/create-tutorial")
})
router.get("/review-tutorial", function(req, res) {
  res.render("contribute-components/review-tutorial")
})

module.exports = router
