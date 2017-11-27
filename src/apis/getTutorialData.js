'use strict'
const _ = require('lodash')
const github = require('../github-client')
const Base64 = require('js-base64').Base64
const constants = require('../../config/constants.json')
const branchPrefix = constants.BRANCH_PREFIX
const basePath = constants.TUTORIALS_PATH
const repoName = constants.REPO
module.exports = function (req, res) {
  // get authenticated user
  const branchName = _.get(req, 'params.branch')
  const branch = `${branchPrefix}/${branchName}`
  const configPath = `${basePath}/${branchName}/config.json`
  const contentPath = `${basePath}/${branchName}/content.json`
  const exercisesPath = `${basePath}/${branchName}/exercises.json`
  return github.users.get({})
  .then((result) => {
    const login = result.data.login
    return login
  })
  .then((username) => {
    return github.repos.getContent({
      owner: username,
      repo: repoName,
      path: configPath,
      ref: branch
    })
    .then((configFile) => {
      const configData = JSON.parse(Base64.decode(configFile.data.content))
      console.dir({ configData }, {depth: 10})
      return github.repos.getContent({
        owner: username,
        repo: repoName,
        path: contentPath,
        ref: branch
      })
      .then((contentFile) => {
        const contentData = JSON.parse(Base64.decode(contentFile.data.content))
        console.dir({ contentData }, {depth: 10})
        return github.repos.getContent({
          owner: username,
          repo: repoName,
          path: exercisesPath,
          ref: branch
        })
        .then((exerciseFile) => {
          const exerciseData = JSON.parse(Base64.decode(exerciseFile.data.content))
          console.dir({ exerciseData }, {depth: 10})
          res.send({ config: configData, content: contentData, exercises: exerciseData })
        })
      })
    })
  })
  .catch((err) => {
    console.log('error getting tutorial Data', err)
    res.status(err.code).send(err)
  })
}
