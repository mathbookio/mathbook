"use strict"

const Promise = require("bluebird")
const moment = require("moment")
const _ = require("lodash")
const github = require("../github-client")
const Base64 = require("js-base64").Base64
const constants = require("../../config/constants.json")
const branchPrefix = constants.BRANCH_PREFIX
const basePath = constants.TUTORIALS_PATH
const repoName = constants.REPO

module.exports = async function(req, res) {
  const data = JSON.parse(req.body.data)
  const configData = _.get(data, "config", {})
  const contentData = _.get(data, "content", [])
  const exerciseData = _.get(data, "exercises", [])
  const branchName = _.get(data, "tutorialName")
  try {
    const currentDate = moment().format("MMMM Do YYYY, h:mm:ss a")
    const username = await getUsername()

    await saveFile("config", username, branchName, configData, currentDate)
    await saveFile("content", username, branchName, contentData, currentDate)
    await saveFile("exercises", username, branchName, exerciseData, currentDate)
    res.sendStatus(204)
  } catch (err) {
    console.log(err)
    const error = {
      status: 500,
      code: "InternalServerError",
      message: "Uh-oh, something went wrong in the server-side of things. Unable to save tutorial state"
    }
    res.status(error.status).send(error)
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
      err.source = "saveTutorial::getUsername::catch::err"
      err.params = {}
      return Promise.reject(err)
    })
}

async function saveFile(fileType, username, branchName, data, currentDate) {
  const file = await getFile(fileType, username, branchName)
  const sha = file.sha
  return updateFile(fileType, username, branchName, data, sha, currentDate)
}

function getFile(fileType, username, branchName) {
  return github.repos
    .getContent({
      owner: username,
      repo: repoName,
      path: `${basePath}/${branchName}/${fileType}.json`,
      ref: `${branchPrefix}/${branchName}`
    })
    .then(contentFile => contentFile.data)
    .catch(err => {
      err.source = "saveTutorial::getFile::catch::err"
      err.params = { fileType, username, branchName }
      return Promise.reject(err)
    })
}

function updateFile(fileType, username, branchName, data, sha, currentDate) {
  return Promise.try(() => Base64.encode(JSON.stringify(data, null, 4)))
    .then(updatedContent =>
      github.repos.updateFile({
        owner: username,
        repo: repoName,
        path: `${basePath}/${branchName}/${fileType}.json`,
        branch: `${branchPrefix}/${branchName}`,
        message: `${currentDate} - updated ${fileType} file`,
        sha: sha,
        content: updatedContent
      })
    )
    .catch(err => {
      err.source = "saveTutorial::updateFile::catch::err"
      err.params = { fileType, username, branchName, data, currentDate }
      return Promise.reject(err)
    })
}
