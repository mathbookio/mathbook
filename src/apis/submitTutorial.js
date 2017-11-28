'use strict'
const github = require('../github-client')
const constants = require('../../config/constants.json')
const branchPrefix = constants.BRANCH_PREFIX

module.exports = function (req, res) {
  console.log("YOU HIT /v1/submit/tutorial")
  const tutorialName = req.body.tutorialName
  let submitDescription = req.body.submitDescription
  // get authenticated user
  return github.users.get({})
  .then((result) => {
    const login = result.data.login
    console.log('login', login)
    return login
  })
  .then((username) => {
    const repo = 'testing'
    const reviewUrl = `http://localhost:4000/review/${username}/${tutorialName}`
    submitDescription += `\n\n Here is the link to preview the tutorial [${reviewUrl}](${reviewUrl})`
    return github.pullRequests.create({
      owner: 'JetJet13',
      repo: repo,
      title: `merge tutorial ${tutorialName} into master`,
      body: submitDescription,
      head: `${username}:${branchPrefix}/${tutorialName}`,
      base: 'master'
    })
  })
  .then((prResult) => {
    console.log({ prResult })
    const pullRequestUrl = prResult.data['html_url']
    res.send({ submitted: true, pullRequestUrl: pullRequestUrl, tutorial: tutorialName })
  })
  .catch((err) => {
    console.log('error submitting branches/tutorial', err)
    res.status(400).send(err)
  })
}
