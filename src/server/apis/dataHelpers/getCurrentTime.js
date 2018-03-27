"use strict"
const moment = require("moment")
module.exports = function() {
  return moment.utc().format("MMMM Do YYYY, h:mm:ss a")
}
