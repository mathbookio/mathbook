const Messenger = {
  obs: riot.observable(),
  send: function(title, ...args) {
    this.obs.trigger(title, ...args)
  },
  subscribe: function(title, func) {
    this.obs.on(title, func)
  }
}

// enum for all topics being handled
const MessageTopic = {
  TutorialUpdate: "tutorialUpdate"
}
