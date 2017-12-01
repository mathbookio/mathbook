"use strict"

const _ = require("lodash")
const getTutorialData = require("./dataHelpers/getTutorialData")

module.exports = function(req, res) {
  const log = req.log
  const username = _.get(req, "params.user", "")
  const tutorialName = _.get(req, "params.tutorialName", "")
  return getTutorialData(tutorialName, username, log)
    .then(data => res.send(data))
    .catch(err => res.status(err.status).send(err))
}
