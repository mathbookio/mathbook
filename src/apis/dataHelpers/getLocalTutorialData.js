"use strict"

const _ = require("lodash")
const github = require("../../github-client")
const Base64 = require("js-base64").Base64
const constants = require("../../../config/constants.json")
const branchPrefix = constants.BRANCH_PREFIX
const basePath = constants.TUTORIALS_PATH
const fs = require("fs")
const repoName = constants.REPO
module.exports = async function(subject, tutorialName) {
  if (!_.isString(subject) || _.isEmpty(subject)) {
    return Promise.reject({
      status: 400,
      code: "BadRequest",
      message: "subject is invalid"
    })
  } else if (!_.isString(tutorialName) || _.isEmpty(tutorialName)) {
    return Promise.reject({
      status: 400,
      code: "BadRequest",
      message: "tutorialName is invalid"
    })
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
    err.source = "dataHelper::getLocalTutorialData::catch::err"
    console.log(err)
    let error
    if (err.code === "ENOENT") {
      console.log("someone requested a tutorial that is not stored locally", { subject, tutorialName })
      error = {
        status: 404,
        code: "ResourceNotFound",
        message: "the tutorial you requested does not exist."
      }
    } else {
      error = {
        status: 500,
        code: "InternalServerError",
        message: "Uh-oh something broke on our side of things."
      }
    }
    return Promise.reject(error)
  }
}
