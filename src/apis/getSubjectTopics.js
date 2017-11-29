'use strict'

const _ = require('lodash')
const getLocalTopicsData = require('./dataHelpers/getLocalTopicsData')

module.exports = function (req, res) {
  const subject = _.get(req, 'params.subject', '')
  console.log({ subject })
  return getLocalTopicsData(subject)
  .then((data) => res.send(data))
  .catch((err) => {
    console.error('reviewTutorial::getTutorialDataBySubject', err)
    res.status(400).send(err)
  })
}