"use strict"

const _ = require("lodash")
const getLocalTutorialData = require("./dataHelpers/getLocalTutorialData")

module.exports = function(req, res) {
  const log = req.log
  const subject = _.get(req, "params.subject", "")
  const tutorialName = _.get(req, "params.tutorialName", "")
  return getLocalTutorialData(subject, tutorialName, log)
    .then(data => res.send(data))
    .catch(err => res.status(err.status).send(err))
}
