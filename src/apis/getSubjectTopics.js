"use strict"

const _ = require("lodash")
const getLocalTopicsData = require("./dataHelpers/getLocalTopicsData")

module.exports = function(req, res) {
  const log = req.log
  const subject = _.get(req, "params.subject", "")
  return getLocalTopicsData(subject, log)
    .then(data => res.send(data))
    .catch(err => res.status(err.status).send(err))
}
