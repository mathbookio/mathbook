"use strict"

const express = require("express")
const router = express.Router()

router.get("/:subject/:tutorialName", (req, res) => {
  res.render("view-tutorial", { tutorialName: req.params.tutorialName, subject: req.params.subject })
})

module.exports = router
