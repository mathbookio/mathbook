const _ = require('lodash')

function formatter (data) {
  if (_.isArray(data)) {
    _.forEach(data, function (item) {
      formatter(item)
    })
  } else {
    for (let key in data) {
      if (key.includes('#')) {
        const newKey = key.replace('#', '')
        data[newKey] = data[key].join('')
        delete data[key]
      }
    }
  }
  return data
}

module.exports = formatter
