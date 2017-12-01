"use strict"

module.exports = function(err, source, params = {}) {
  err["details"] = {
    source: source,
    params: params
  }
  return err
}
