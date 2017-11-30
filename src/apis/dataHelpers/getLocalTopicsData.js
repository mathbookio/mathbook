"use strict"
const _ = require("lodash")
const fs = require("fs")
const subjectMap = require("../../subjectMap.json")
const constants = require("../../../config/constants.json")
console.log("CONSTANTS", constants)
const branchPrefix = constants.BRANCH_PREFIX
const basePath = constants.TUTORIALS_PATH
const Promise = require("bluebird")

module.exports = async function(subject) {
  if (!_.isString(subject) || _.isEmpty(subject)) {
    const error = {
      status: 400,
      code: "BadRequest",
      message: "subject is invalid"
    }
    return Promise.reject(error)
  }
  const requestedSubject = _.find(subjectMap, item => item.id === subject)
  if (requestedSubject === undefined) {
    console.log("the client requested a subject that is not in our subjectMap. Throw an error", err)
    error = {
      status: 404,
      code: "ResourceNotFound",
      message: "The subject you requested does not exist on Mathbook."
    }
    return Promise.reject(error)
  }

  try {
    let topics = []
    const subjectTopicsPath = `${basePath}/${subject}/topics.json`
    const topicFileExists = fs.existsSync(subjectTopicsPath)
    if (topicFileExists) {
      topics = JSON.parse(fs.readFileSync(subjectTopicsPath, "utf-8"))
    }
    return Promise.resolve({
      topics: topics,
      subjectData: requestedSubject
    })
  } catch (err) {
    err.source = "dataHelper::getLocalTopicsData::catch::err"
    console.log(err)
    const error = {
      status: 500,
      code: "InternalServerError",
      message: "Uh-oh, something broke on the server-side of things."
    }
    return Promise.reject(error)
  }
}
