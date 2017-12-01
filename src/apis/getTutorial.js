"use strict"
const _ = require("lodash")
const getTutorialData = require("./dataHelpers/getTutorialData")
module.exports = function(req, res) {
  const log = req.log
  const branchName = _.get(req, "params.tutorialName")
  return getTutorialData(branchName, null, log)
    .then(data => res.send(data))
    .catch(err => res.status(err.status).send(err))
}
