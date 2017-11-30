"use strict"
const _ = require("lodash")
const github = require("../../github-client")
const Base64 = require("js-base64").Base64
const constants = require("../../../config/constants.json")
const branchPrefix = constants.BRANCH_PREFIX
const basePath = constants.TUTORIALS_PATH
const repoName = constants.REPO
module.exports = async function(branchName, username = null) {
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

    const contentData = await github.repos
      .getContent({
        owner: username,
        repo: repoName,
        path: contentPath,
        ref: branch
      })
      .then(contentFile => JSON.parse(Base64.decode(contentFile.data.content)))

    const exerciseData = await github.repos
      .getContent({
        owner: username,
        repo: repoName,
        path: exercisesPath,
        ref: branch
      })
      .then(exerciseFile => JSON.parse(Base64.decode(exerciseFile.data.content)))

    return {
      config: configData,
      content: contentData,
      exercises: exerciseData
    }
  } catch (err) {
    console.log("dataHelper::error getting tutorial Data", err)
    if (err.code === 404) {
      const error = {
        status: 404,
        code: "ResourceNotFound",
        message: "Uh-oh, the tutorial data could not be found."
      }
      return Promise.reject(error)
    }
    const error = {
      status: 500,
      code: "InternalServerError",
      message: "Uh-oh, we were unable to retrieve the data we need due to some unknown issue."
    }
    return Promise.reject(error)
  }
}

function getUsername() {
  return github.users.get({}).then(result => {
    const login = result.data.login
    return login
  })
}
