'use strict'
const _ = require('lodash')
const github = require('../github-client')
const Promise = require('bluebird')
module.exports = function (req, res) {
  // get authenticated user
  const repo = 'testing'
  return github.users.get({})
  .then((result) => {
    const login = result.data.login
    return login
  })
  .then((username) => {
    return github.repos.getBranches({
      owner: username,
      repo: repo
    })
    .then((branches) => {
      console.dir({ branches }, {depth: 10})
      return { branches, username }
    })
  })
  .then(({ branches, username }) => {
    Promise.map(branches.data, (branch) => {
      if (branch.name === 'master') {
        return
      }
      const name = branch.name.replace('tutorial/', '')
      return github.repos.getBranch({
        owner: username,
        repo: repo,
        branch: branch.name
      })
      .then((branchData) => {
        console.dir({ branchData }, { depth: 10 })
        const lastEdited = _.get(branchData, 'data.commit.commit.committer.date')
        console.log('lastEdited', lastEdited)
        return isSubmitted(`${username}:${branch.name}`)
        .then((submitResult) => {
          return { name, isSubmitted: submitResult, lastEdited }
        })
      })
    })
    .then((tutorials) => {
      const validTutorials = tutorials.filter((tutorial) => tutorial !== undefined)
      return res.send({ tutorials: validTutorials })
    })
  })
  .catch((err) => {
    console.log('error getting branches/tutorials', err)
    res.send(err)
  })
}

function isSubmitted (branch) {
  return github.pullRequests.getAll({
    owner: 'JetJet13',
    repo: 'testing',
    head: branch,
    state: 'open'
  })
  .then((prResult) => {
    console.dir({ prResult }, { depth: 10 })
    if (_.isEmpty(prResult.data)) {
      return false
    } else if (prResult.data[0].state === 'open') {
      return true
    }
    return false
  })
  .catch((err) => {
    console.log({err, title: `isSubmitted for branch ${branch} threw an error`})
    return false
  })
}
