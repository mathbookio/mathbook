"use strict"

const _ = require("lodash")
const errors = require("../errors")
const saveFile = require("./dataHelpers/saveFile")
const getCurrentTime = require("./dataHelpers/getCurrentTime")
const getUsername = require("./dataHelpers/getUsername")

module.exports = async function(req, res) {
  const log = req.log
  const hashToken = _.get(req.cookies, "hashToken")
  const data = JSON.parse(req.body.data)
  const configData = _.get(data, "config", {})
  const contentData = _.get(data, "content", [])
  const exerciseData = _.get(data, "exercises", [])
  const branchName = _.get(data, "tutorialName")
  try {
    const currentDate = getCurrentTime()
    const username = await getUsername(hashToken)

    await saveFile("config", username, branchName, configData, currentDate)
    await saveFile("content", username, branchName, contentData, currentDate)
    await saveFile("exercises", username, branchName, exerciseData, currentDate)
    res.sendStatus(204)
  } catch (err) {
    const head = "saveTutorial"
    log.error({ err, details: err.details, head }, "failed to save tutorial state")
    const error = new errors.InternalServerError(
      "Uh-oh, something went wrong in the server-side of things. Unable to save tutorial state"
    )
    res.status(error.status).send(error)
  }
}
