'use strict'
const _ = require('lodash')
const github = require('../github-client')

module.exports = function (req, res) {
  const branchName = _.get(req, 'body.branchName')
  console.log({ branchName })
  const repo = 'testing'
  const referenceSHA = 'f5f9aa2666a54e3ad619a550efbdf5179f06aec3'
  return getUsername()
  .then((username) => {
    return isRepoForked(username)
    .then((isForked) => {
      if (isForked) {
        return username
      }
      return github.repos.fork({
        owner: username,
        repo: repo
      })
      .then((forkResult) => username)
    })
  })
  .then((username) => {
    console.log('user', username)
    const ref = `refs/heads/tutorial/${branchName}`
    return isBranchExist(username, repo, ref)
    .then((isBranch) => {
      if (isBranch) {
        console.log('isBranch is true', isBranch)
        res.send({ username, isBranch })
        return
      }
      return github.gitdata.createReference({
        owner: username,
        repo: repo,
        ref: ref,
        sha: referenceSHA
      })
      .then((branchResult) => {
        console.log('created a new branch')
        res.send({ username, isBranch })
      })
    })
  })
  .catch((err) => {
    console.log('error /v1/fork', err)
    res.render('error', err)
  })
}

function getUsername () {
  return github.users.get({})
  .then((user) => user.data.login)
}

function isRepoForked (username) {
  const repo = 'testing'
  return github.repos.get({
    owner: username,
    repo: repo
  })
  .then((repository) => {
    console.log('repository', repository)
    return true
  })
  .catch((err) => {
    console.log('error getting tutorials', err)
    return false
  })
}

function isBranchExist (owner, repo, branch) {
  return github.repos.getBranch({
    owner,
    repo,
    branch
  })
  .then((branchResult) => {
    console.log({ branchResult })
    return true
  })
  .catch((err) => {
    console.log({ title: 'isBranchExist failed for the following reason', err })
    return false
  })
}
