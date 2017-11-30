"use strict"

const express = require("express")
const router = express.Router()

// define the home page route
router.get("/:tutorialName", function(req, res) {
  const tutorialName = req.params.tutorialName
  res.render("editor", { tutorialName })
})

module.exports = router
