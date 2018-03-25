<auto-save>
  <div class="section-padding container">
    <div class="content is-small has-text-grey">
      Auto Save:
      <span show={ state === autoSaveStates.Saving }>
        <span class="icon is-small has-text-info">
          <i class="fa fa-spin fa-sync"></i>
        </span>
      </span>
      <span show={ state === autoSaveStates.Saved }>
        <span class="icon is-small has-text-success">
          <i class="fa fa-check"></i>
        </span>
        Saved at { currentTime }</span>
      <span show={ state === autoSaveStates.Failed }>
        <span class="icon is-small has-text-danger">
          <i class="fa fa-times"></i>
        </span>
        Failed { currentTime }
      </span>
    </div>
  </div>
  <script>
    var self = this
    this.autoSaveStates = {
      Saved: 'saved',
      Saving: 'saving',
      Failed: 'failed',
      None: 'none'
    }
    this.state = this.autoSaveStates.None
    
    this.on('mount', function () {
      webSocket.on('saved', function () {
        self.updateState(self.autoSaveStates.Saved)
      })
      webSocket.on('saveFailed', function () {
        self.updateState(self.autoSaveStates.Failed)
      })
      $(document).on('input', debounce(function () {
        const includeWorkInProgress = true
        const data = self.parent.get(includeWorkInProgress)
        self.updateState(self.autoSaveStates.Saving)
        cacheTutorial(data)
      }))
    })

    updateState(newState){
      if (newState === self.autoSaveStates.Saving){
        self.state = newState
        self.update()
        return
      }
      // small delay for better ux for 'saved' and 'failing' states.
      setTimeout(function() {
        self.state = newState
        self.currentTime = new Date().toLocaleTimeString()
        self.update()
      }, 250)
    }
  </script>
</auto-save>