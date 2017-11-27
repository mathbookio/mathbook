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
        return getTutorialState(`${username}:${branch.name}`)
        .then((submitResult) => {
          return { name, state: submitResult.state, pullRequestUrl: submitResult.pullRequestUrl, lastEdited }
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

function getTutorialState (branch) {
  return github.pullRequests.getAll({
    owner: 'JetJet13',
    repo: 'testing',
    head: branch,
    state: 'all'
  })
  .then((prResult) => {
    if (_.isEmpty(prResult.data)){
      return { state: null, pullRequestUrl: null }
    }
    const pullRequestNumber = _.get(prResult, 'data.0.number', null)
    let state = _.get(prResult, 'data.0.state', null)
    const isMerged = _.get(prResult, 'data.0.merged_at') !== null ? true : false
    const pullRequestUrl = _.get(prResult, 'data.0.html_url', null)
    return github.pullRequests.getReviews({
      owner: 'JetJet13',
      repo: 'testing',
      number: pullRequestNumber
    })
    .then((prReviews) => {
      if (prReviews.data.length > 0){
        const latestReview = _.last(prReviews.data)
        if (latestReview.state === 'CHANGES_REQUESTED'){
          state = 'changesRequested'
        }
        else if (latestReview.state === 'APPROVED'){
          state = 'approved'
        }
      }
      return { 
        state: isMerged ? 'merged' : state,
        pullRequestUrl: pullRequestUrl 
      }
    })
  })
  .catch((err) => {
    console.log({err, title: `isSubmitted for branch ${branch} threw an error`})
    return false
  })
}

