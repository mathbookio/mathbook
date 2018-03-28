"use strict"

const Promise = require("bluebird")
const github = require("../../githubClient")
const Base64 = require("js-base64").Base64
const transformError = require("../../transformers/errorTransformer")
const constants = require("../../../../config/constants.json")
const branchPrefix = constants.BRANCH_PREFIX
const basePath = constants.TUTORIALS_PATH
const repoName = constants.REPO

module.exports = async function(fileType, username, branchName, data, currentDate) {
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
      const source = "saveFile::getFile::catch::err"
      const params = { fileType, username, branchName }
      return Promise.reject(transformError(err, source, params))
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
      const source = "saveFile::updateFile::catch::err"
      const params = { fileType, username, branchName, data, currentDate }
      return Promise.reject(transformError(err, source, params))
    })
}
