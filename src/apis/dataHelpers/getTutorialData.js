"use strict"
const _ = require("lodash")
const github = require("../../github-client")
const Base64 = require("js-base64").Base64
const errors = require("../../errors")
const transformError = require("../../transformers/errorTransformer")
const constants = require("../../../config/constants.json")
const branchPrefix = constants.BRANCH_PREFIX
const basePath = constants.TUTORIALS_PATH
const repoName = constants.REPO
module.exports = async function(branchName, username = null, log) {
  // get authenticated user
  const branch = `${branchPrefix}/${branchName}`
  const configPath = `${basePath}/${branchName}/config.json`
  const contentPath = `${basePath}/${branchName}/content.json`
  const exercisesPath = `${basePath}/${branchName}/exercises.json`
  try {
    if (username === null) {
      username = await getUsername()
    }

    const configData = await github.repos
      .getContent({
        owner: username,
        repo: repoName,
        path: configPath,
        ref: branch
      })
      .then(configFile => JSON.parse(Base64.decode(configFile.data.content)))
      .catch(err => {
        const source = "dataHelper::getTutorialData::configData::catch:err"
        const params = { branchName, username }
        return Promise.reject(transformError(err, source, params))
      })

    const contentData = await github.repos
      .getContent({
        owner: username,
        repo: repoName,
        path: contentPath,
        ref: branch
      })
      .then(contentFile => JSON.parse(Base64.decode(contentFile.data.content)))
      .catch(err => {
        const source = "dataHelper::getTutorialData::contentData::catch:err"
        const params = { branchName, username }
        return Promise.reject(transformError(err, source, params))
      })

    const exerciseData = await github.repos
      .getContent({
        owner: username,
        repo: repoName,
        path: exercisesPath,
        ref: branch
      })
      .then(exerciseFile => JSON.parse(Base64.decode(exerciseFile.data.content)))
      .catch(err => {
        const source = "dataHelper::getTutorialData::exerciseData::catch:err"
        const params = { branchName, username }
        return Promise.reject(transformError(err, source, params))
      })

    return Promise.resolve({
      config: configData,
      content: contentData,
      exercises: exerciseData
    })
  } catch (err) {
    log.error({ err, details: err.details }, "failed to get tutorial data from github.")
    let error
    if (err.code === 404) {
      error = new errors.ResourceNotFound("The tutorial data could not be found")
    } else {
      error = new errors.InternalServerError(
        "Uh-oh, we were unable to retrieve the data we need due to some unknown issue."
      )
    }
    return Promise.reject(error)
  }
}

function getUsername() {
  return github.users
    .get({})
    .then(result => {
      const login = result.data.login
      return login
    })
    .catch(err => {
      const source = "dataHelper::getTutorialData::getUsername::catch:err"
      const params = {}
      return Promise.reject(transformError(err, source, params))
    })
}
