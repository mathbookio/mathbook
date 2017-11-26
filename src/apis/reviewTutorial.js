'use strict'

const _ = require('lodash')
const github = require('../github-client')
const Base64 = require('js-base64').Base64
module.exports = function (req, res) {
  const user = _.get(req, 'params.user', '')
  const tutorialName = _.get(req, 'params.tutorialName', '')
  const branch = `tutorial/${tutorialName}`
  const owner = 'JetJet13'
  const repo = 'testing'
  const head = `${user}:tutorial/${tutorialName}`
  const configPath = `${branch}/config.json`
  const contentPath = `${branch}/content.json`
  const exercisesPath = `${branch}/exercises.json`
  console.log({
    head
  })
  return github.pullRequests.getAll({
      owner: owner,
      repo: repo,
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
          repo: repo,
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
              repo: repo,
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
                  repo: repo,
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