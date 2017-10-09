'use strict'
const _ = require('lodash')
const github = require('../github-client')

module.exports = function (req, res) {
  const owner = 'JetJet13'
  const repo = 'testing'

  return github.repos.fork({
    owner: owner,
    repo: repo
  })
  .then((result) => {
    console.log('result', result)
    res.send(result)
  })
  .catch((err) => {
    console.log('error forking repo', err)
    res.render('error', err)
  })
}
