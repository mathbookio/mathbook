const wsProtocol = location.protocol
const wsDomain = location.hostname
const wsPort = location.port

/**
 * HEADS UP!
 * Since we are proxying the server via browsersync during development,
 * socket.io will try to connect using a websocket connection with the
 * following url and it will fail because wsPort=proxyPort. This is
 * acceptable because socket.io will fall back to long polling if
 * websocket connections fail/aren't supported by the browser.
 */
const wsUrl = `${wsProtocol}//${wsDomain}:${wsPort}`
const webSocket = io(wsUrl)
webSocket.on("connect", function() {
  console.log("Websocket Connected")
})

webSocket.on("disconnect", function() {
  console.log("Websocket Disconnected")
})

webSocket.on("reconnect", attemptNumber => {
  console.log("Websocket Reconnected")
})

webSocket.on("reconnecting", attemptNumber => {
  console.log("Websocket Reconnecting::attemptNumber", attemptNumber)
})

webSocket.on("reconnect_failed", () => {
  console.log("Websocket failed to reconnect. Exhausted all reconnect attempts.")
})

webSocket.on("reconnect_error", error => {
  console.error("Websocket - ReconnectError", error)
})

const WebSocketService = {
  cacheTutorial: function(data) {
    data["hashToken"] = Cookies.get("hashToken")
    webSocket.emit(WebSocketTopics.CacheTutorial, data)
  }
}

const WebSocketTopics = {
  CacheTutorial: "cacheTutorial",
  Saved: "saved",
  SaveFailed: "saveFailed"
}
