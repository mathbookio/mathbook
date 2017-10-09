'use strict'
const _ = require('lodash')
const github = require('../github-client')

module.exports = function (req, res) {
  // get authenticated user
  return github.users.get({})
  .then((result) => {
    console.log('result', result.data)
    const login = result.data.login
    console.log('login', login)
    return login
  })
  .then((username) => {
    const repo = 'testing'
    return github.repos.get({
      owner: username,
      repo: repo
    })
  })
  .then((repository) => {
    console.log('repository', repository)
    res.send(repository)
  })
  .catch((err) => {
    console.log('error getting tutorials', err)
    res.send(err)
  })
}
