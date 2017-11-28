'use strict'

const _ = require('lodash')
const getTutorialData = require('./dataHelpers/getTutorialData')

module.exports = function (req, res) {
  const user = _.get(req, 'params.user', '')
  const tutorialName = _.get(req, 'params.tutorialName', '')
  return getTutorialData(tutorialName, user)
  .then((data) => res.send(data))
  .catch((err) => {
    console.error('reviewTutorial::getTutorialData', err)
    res.status(err.code).send(err)
  })
  
}