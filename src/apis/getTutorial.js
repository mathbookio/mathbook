"use strict"
const _ = require("lodash")
const getTutorialData = require("./dataHelpers/getTutorialData")
module.exports = function(req, res) {
  // get authenticated user
  const branchName = _.get(req, "params.tutorialName")
  return getTutorialData(branchName)
    .then(data => res.send(data))
    .catch(err => {
      console.log("error getting tutorial Data", err)
      res.status(err.status).send(err)
    })
}
