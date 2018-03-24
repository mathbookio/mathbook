"use strict"
const _ = require("lodash")
const getTutorialData = require("./dataHelpers/getTutorialData")
const getCachedTutorial = require("./dataHelpers/getCachedTutorial")
module.exports = function(req, res) {
  const log = req.log
  const branchName = _.get(req, "params.tutorialName")
  const hashToken = _.get(req.cookies, "hashToken")
  return getCachedTutorial(hashToken, branchName, log)
    .then(cacheData => {
      if (cacheData) {
        res.send({ data: JSON.parse(cacheData), metadata: { expiresOn: req.expiresOn } })
        return
      }
      return getTutorialData(branchName, null, log).then(data =>
        res.send({ data, metadata: { expiresOn: req.expiresOn } })
      )
    })
    .catch(err => res.status(err.status).send(err))
}
