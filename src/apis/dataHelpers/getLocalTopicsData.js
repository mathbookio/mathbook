"use strict"
const _ = require("lodash")
const fs = require("fs")
const subjectMap = require("../../subjectMap.json")
const constants = require("../../../config/constants.json")
console.log("CONSTANTS", constants)
const branchPrefix = constants.BRANCH_PREFIX
const basePath = constants.TUTORIALS_PATH
const Promise = require("bluebird")

module.exports = function(subject) {
  if (!_.isString(subject) || _.isEmpty(subject)) {
    return Promise.reject({
      status: 400,
      code: "BadRequest",
      message: "subject is invalid"
    })
  }
  // get authenticated user
  const subjectData = _.find(subjectMap, item => item.id === subject)
  try {
    const subjectTopicsPath = `${basePath}/${subject}/topics.json`
    console.log("subject", subject)
    const topicData = fs.readFileSync(subjectTopicsPath, "utf-8")
    return Promise.resolve({
      topics: JSON.parse(topicData),
      subjectData: subjectData
    })
  } catch (err) {
    if (subjectData === undefined) {
      console.log("the client requested a subject that is not in our subjectMap. Throw an error", err)
      return Promise.reject({
        status: 404,
        code: "ResourceNotFound",
        message: "The subject you requested does not exist on Mathbook."
      })
    }
    console.log("dataHelper::error getting local tutorial Data", err)
    return Promise.resolve({ topics: [], subjectData: subjectData })
  }
}
