"use strict"
const _ = require("lodash")
const fs = require("fs")
const subjectMap = require("../../subjectMap.json")
const errors = require("../../errors")
const transformError = require("../../transformers/errorTransformer")
const constants = require("../../../config/constants.json")
const branchPrefix = constants.BRANCH_PREFIX
const basePath = constants.TUTORIALS_PATH
const Promise = require("bluebird")

module.exports = async function(subject, log) {
  if (!_.isString(subject) || _.isEmpty(subject)) {
    const error = new errors.BadRequestError("subject is invalid")
    return Promise.reject(error)
  }
  const requestedSubject = _.find(subjectMap, item => item.id === subject)
  if (requestedSubject === undefined) {
    const error = new errors.ResourceNotFound("The subject you requested does not exist on Mathbook.")
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
    const source = "dataHelper::getLocalTopicsData::catch::err"
    const params = { subject }
    err = transformError(err, source, params)
    log.error({ err, details: err.details }, "failed to get topics for a subject")
    const error = new errors.InternalServerError("Uh-oh, something broke on the server-side of things.")
    return Promise.reject(error)
  }
}
