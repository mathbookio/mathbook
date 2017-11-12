'use strict'
const _ = require('lodash')
const github = require('../github-client')
const Base64 = require('js-base64').Base64

module.exports = function (req, res) {
  // get authenticated user
  const branchName = _.get(req, 'params.branch')
  const branch = `tutorial/${branchName}`
  const configPath = `${branch}/config.json`
  const contentPath = `${branch}/content.json`
  const exercisesPath = `${branch}/exercises.json`
  const repo = 'testing'
  return github.users.get({})
  .then((result) => {
    const login = result.data.login
    return login
  })
  .then((username) => {
    return github.repos.getContent({
      owner: username,
      repo: repo,
      path: configPath,
      ref: branch
    })
    .then((configFile) => {
      const configData = JSON.parse(Base64.decode(configFile.data.content))
      console.dir({ configData }, {depth: 10})
      return github.repos.getContent({
        owner: username,
        repo: repo,
        path: contentPath,
        ref: branch
      })
      .then((contentFile) => {
        const contentData = JSON.parse(Base64.decode(contentFile.data.content))
        console.dir({ contentData }, {depth: 10})
        return github.repos.getContent({
          owner: username,
          repo: repo,
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
    res.send(err)
  })
}
