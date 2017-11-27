'use strict'

const _ = require('lodash')
const github = require('../github-client')
const Base64 = require('js-base64').Base64
const constants = require('../../config/constants.json')
const branchPrefix = constants.BRANCH_PREFIX
const repoOwner = constants.OWNER
const repoName = constants.REPO
const basePath = constants.TUTORIALS_PATH

module.exports = function (req, res) {
  const user = _.get(req, 'params.user', '')
  const tutorialName = _.get(req, 'params.tutorialName', '')
  const branch = `${branchPrefix}/${tutorialName}`
  const head = `${user}:${branchPrefix}/${tutorialName}`
  const configPath = `${basePath}/${tutorialName}/config.json`
  const contentPath = `${basePath}/${tutorialName}/content.json`
  const exercisesPath = `${basePath}/${tutorialName}/exercises.json`
  console.log({
    head
  })
  return github.pullRequests.getAll({
      owner: repoOwner,
      repo: repoName,
      state: 'open',
      head: head
    })
    .then((result) => {
      const exists = _.get(result, 'data', []).length > 0

      if (exists === false) {
        res.status(404).send({ code: 'ResourceNotFound', message: 'No open PR is available for the requested user and tutorial.' })
        return
      }
      console.dir({ result }, { depth: 100 })
      return github.repos.getContent({
          owner: user,
          repo: repoName,
          path: configPath,
          ref: branch
        })
        .then((configFile) => {
          const configData = JSON.parse(Base64.decode(configFile.data.content))
          console.dir({
            configData
          }, {
            depth: 10
          })
          return github.repos.getContent({
              owner: user,
              repo: repoName,
              path: contentPath,
              ref: branch
            })
            .then((contentFile) => {
              const contentData = JSON.parse(Base64.decode(contentFile.data.content))
              console.dir({
                contentData
              }, {
                depth: 10
              })
              return github.repos.getContent({
                  owner: user,
                  repo: repoName,
                  path: exercisesPath,
                  ref: branch
                })
                .then((exerciseFile) => {
                  const exerciseData = JSON.parse(Base64.decode(exerciseFile.data.content))
                  console.dir({
                    exerciseData
                  }, {
                    depth: 10
                  })
                  res.send({
                    config: configData,
                    content: contentData,
                    exercises: exerciseData
                  })
                })
            })
        })
    })

}