"use strict"
const socketIo = require("socket.io")
const log = require("./logger")
const cacheTutorial = require("./apis/dataHelpers/cacheTutorial")

module.exports = function(server) {
  const io = socketIo(server)
  io.on("connection", function(client) {
    client.on("cacheTutorial", function(data) {
      cacheTutorial(data, log).then(() => {
        client.emit("saved")
      })
    })
  })
  return io
}
