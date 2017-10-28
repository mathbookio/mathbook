'use strict'
const github = require('../github-client')

module.exports = function (req, res) {
  const tutorialName = req.body.tutorialName
  const submitDescription = req.body.submitDescription
  // get authenticated user
  return github.users.get({})
  .then((result) => {
    const login = result.data.login
    console.log('login', login)
    return login
  })
  .then((username) => {
    const repo = 'testing'
    return github.pullRequests.create({
      owner: 'JetJet13',
      repo: repo,
      title: `merge tutorial ${tutorialName} into master`,
      body: submitDescription,
      head: `${username}:tutorial/${tutorialName}`,
      base: 'master'
    })
  })
  .then((prResult) => {
    console.log({ prResult })
    res.send({ submitted: true, tutorial: tutorialName })
  })
  .catch((err) => {
    console.log('error submitting branches/tutorials', err)
    res.send(err)
  })
}
