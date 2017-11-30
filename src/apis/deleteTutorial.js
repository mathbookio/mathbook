"use strict"
const _ = require("lodash")
const github = require("../github-client")
const constants = require("../../config/constants.json")
const repoName = constants.REPO
const branchPrefix = constants.BRANCH_PREFIX

module.exports = function(req, res) {
  const tutorialName = _.get(req, "body.tutorialName", "")
  // get authenticated user
  return github.users
    .get({})
    .then(result => {
      const login = result.data.login
      console.log("login", login)
      return login
    })
    .then(username => {
      const repo = "testing"
      return github.gitdata.deleteReference({
        owner: username,
        repo: repoName,
        ref: `heads/${branchPrefix}/${tutorialName}`
      })
    })
    .then(deleteResult => {
      console.log({ deleteResult })
      res.send({ deleted: true, tutorial: tutorialName })
    })
    .catch(err => {
      console.log("error deleting branches/tutorials", err)
      res.status(500).send(err)
    })
}
