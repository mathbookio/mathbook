"use strict"
const _ = require("lodash")
const errors = require("../errors")
const getTutorialData = require("./dataHelpers/getTutorialData")
const getCachedTutorial = require("./dataHelpers/getCachedTutorial")
const getUsername = require("./dataHelpers/getUsername")
module.exports = function(req, res) {
  const log = req.log
  const branchName = _.get(req, "params.tutorialName")
  const hashToken = _.get(req.cookies, "hashToken")
  return getUsername(hashToken)
    .then(username => getCachedTutorial(username, branchName))
    .then(cacheData => {
      if (cacheData) {
        res.send({ data: cacheData, metadata: { expiresOn: req.expiresOn } })
        return
      }
      return getTutorialData(branchName, null, log).then(data =>
        res.send({ data, metadata: { expiresOn: req.expiresOn } })
      )
    })
    .catch(err => {
      const head = "getTutorial"
      log.error({ err, details: err.details, head }, "could not get tutorial.")
      let error
      if (err.code === 404) {
        error = new errors.ResourceNotFound("The tutorial data could not be found")
      } else {
        error = new errors.InternalServerError(
          "Uh-oh, we were unable to retrieve the data we need due to some unknown issue."
        )
      }
      res.status(error.status).send(err)
    })
}
