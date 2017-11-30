"use strict"

const _ = require("lodash")
const express = require("express")
const router = express.Router()

router.get("/:tutorialName", (req, res) => {
  res.render("preview-tutorial", { tutorialName: req.params.tutorialName })
})

module.exports = router
