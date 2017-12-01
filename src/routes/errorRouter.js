"use strict"
const express = require("express")
const router = express.Router()

router.get("/500", (req, res) => {
  res.render("500")
})

module.exports = router
