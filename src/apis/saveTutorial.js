"use strict"

const moment = require("moment")
const _ = require("lodash")
const github = require("../github-client")
const Base64 = require("js-base64").Base64
const constants = require("../../config/constants.json")
const branchPrefix = constants.BRANCH_PREFIX
const basePath = constants.TUTORIALS_PATH
const repoName = constants.REPO

module.exports = function(req, res) {
  console.dir({ body: req.body }, { depth: 10 })
  const data = JSON.parse(req.body.data)
  const configData = _.get(data, "config", {})
  const contentData = _.get(data, "content", [])
  const exerciseData = _.get(data, "exercises", [])
  const branchName = _.get(data, "tutorialName")
  console.log({ configData, contentData, exerciseData, branchName })
  const currentDate = moment().format("MMMM Do YYYY, h:mm:ss a")
  return github.users
    .get({})
    .then(result => {
      const login = result.data.login
      console.log("login", login)
      return login
    })
    .then(username => {
      return github.repos
        .getContent({
          owner: username,
          repo: repoName,
          path: `${basePath}/${branchName}/config.json`,
          ref: `${branchPrefix}/${branchName}`
        })
        .then(configFile => {
          console.dir({ title: "got the config file", configFile }, { depth: 10 })
          const sha = configFile.data.sha
          const configDecoded = Base64.decode(configFile.data.content)
          console.log("decoded config", configDecoded)
          const updatedContent = Base64.encode(JSON.stringify(configData, null, 4))
          console.log("encoded updated config", updatedContent)
          return github.repos
            .updateFile({
              owner: username,
              repo: repoName,
              path: `${basePath}/${branchName}/config.json`,
              branch: `${branchPrefix}/${branchName}`,
              message: `${currentDate} - updated config file`,
              sha: sha,
              content: updatedContent
            })
            .then(updatedConfigFile => {
              return github.repos
                .getContent({
                  owner: username,
                  repo: repoName,
                  path: `${basePath}/${branchName}/content.json`,
                  ref: `${branchPrefix}/${branchName}`
                })
                .then(contentFile => {
                  console.dir({ title: "got the content file", contentFile }, { depth: 10 })
                  const sha = contentFile.data.sha
                  const contentDecoded = Base64.decode(contentFile.data.content)
                  console.log("decoded content file", contentDecoded)
                  const updatedContent = Base64.encode(JSON.stringify(contentData, null, 4))
                  console.log("encoded updated content", updatedContent)
                  return github.repos.updateFile({
                    owner: username,
                    repo: repoName,
                    path: `${basePath}/${branchName}/content.json`,
                    branch: `${branchPrefix}/${branchName}`,
                    message: `${currentDate} - updated content file`,
                    sha: sha,
                    content: updatedContent
                  })
                })
            })
            .then(updateContentFile => {
              console.dir({ updateContentFile })
              return github.repos
                .getContent({
                  owner: username,
                  repo: repoName,
                  path: `${basePath}/${branchName}/exercises.json`,
                  ref: `${branchPrefix}/${branchName}`
                })
                .then(exercisesFile => {
                  console.dir({ title: "got the exercise file", exercisesFile }, { depth: 10 })
                  const sha = exercisesFile.data.sha
                  const contentDecoded = Base64.decode(exercisesFile.data.content)
                  console.log("decoded exercise file", contentDecoded)
                  const updatedContent = Base64.encode(JSON.stringify(exerciseData, null, 4))
                  console.log("encoded updated exercise", updatedContent)
                  return github.repos.updateFile({
                    owner: username,
                    repo: repoName,
                    path: `${basePath}/${branchName}/exercises.json`,
                    branch: `${branchPrefix}/${branchName}`,
                    message: `${currentDate} - updated exercises file`,
                    sha: sha,
                    content: updatedContent
                  })
                })
            })
            .then(updateExerciseFile => {
              console.dir({ updateExerciseFile })
              res.send({ status: 200 })
            })
        })
    })
    .catch(err => {
      console.dir({ title: "error occured for save tutorial", err })
      res.status(400).send(err)
    })
}
