"use strict"
const moment = require("moment")
module.exports.getZulu = function() {
  return moment.utc().format("MMMM Do YYYY, h:mm:ss a")
}
