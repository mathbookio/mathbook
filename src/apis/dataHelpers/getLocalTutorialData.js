"use strict"

const _ = require("lodash")
const github = require("../../github-client")
const Base64 = require("js-base64").Base64
const errors = require("../../errors")
const transformError = require("../../transformers/errorTransformer")
const constants = require("../../../config/constants.json")
const branchPrefix = constants.BRANCH_PREFIX
const basePath = constants.TUTORIALS_PATH
const fs = require("fs")
const repoName = constants.REPO
module.exports = async function(subject, tutorialName, log) {
  if (!_.isString(subject) || _.isEmpty(subject)) {
    return Promise.reject(new errors.BadRequestError("subject is invalid"))
  } else if (!_.isString(tutorialName) || _.isEmpty(tutorialName)) {
    return Promise.reject(new errors.BadRequestError("tutorialName is invalid"))
  }
  // get authenticated user
  const configPath = `${basePath}/${subject}/${tutorialName}/config.json`
  const contentPath = `${basePath}/${subject}/${tutorialName}/content.json`
  const exercisesPath = `${basePath}/${subject}/${tutorialName}/exercises.json`
  try {
    const configData = JSON.parse(fs.readFileSync(configPath, "utf-8"))
    const contentData = JSON.parse(fs.readFileSync(contentPath, "utf-8"))
    const exerciseData = JSON.parse(fs.readFileSync(exercisesPath, "utf-8"))
    return {
      config: configData,
      content: contentData,
      exercises: exerciseData
    }
  } catch (err) {
    const source = "dataHelper::getLocalTutorialData::catch::err"
    const params = { subject, tutorialName }
    err = transformError(err, source, params)
    log.error({ err, details: err.details }, "failed to get local tutorial data")
    let error
    if (err.code === "ENOENT") {
      log.warn("someone requested a tutorial that is not stored locally", { subject, tutorialName })
      error = new errors.ResourceNotFound("the tutorial you requested does not exist.")
    } else {
      error = new errors.InternalServerError("Uh-oh something broke on our side of things.")
    }
    return Promise.reject(error)
  }
}
