"use strict"

const _ = require("lodash")
const errors = require("../errors")
const getTutorialData = require("./dataHelpers/getTutorialData")

module.exports = function(req, res) {
  const log = req.log
  const username = _.get(req, "params.user", "")
  const tutorialName = _.get(req, "params.tutorialName", "")
  return getTutorialData(tutorialName, username, log)
    .then(data => res.send(data))
    .catch(err => {
      const head = "getTutorialByUsername"
      log.error({ err, details: err.details, head }, "failed to get tutorial data from github.")
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
