<builder>
  <style>
    .mathContent {
      font-family: 'consolas';
    }
    .json{
      font-family: 'consolas';
    }

    .moveHandle {
      cursor: move;
      cursor: -webkit-grabbing;
    }
  </style>
  <loading-spinner loading-flag={ isLoading } text={ loadingText }></loading-spinner>
  <session-modal observable={ sessionObservable }></session-modal>
  <section class="section" hide={ isLoading }>
    <div class="tabs is-centered is-boxed">
      <ul>
        <li id="configTab">
          <a onclick={pickConfiguration}>
            <span>Configuration</span>
          </a>
        </li>
        <li id="contentTab">
          <a onclick={pickContent}>
            <span>Content</span>
          </a>
        </li>
        <li id="exercisesTab">
          <a onclick={pickExercises}>
            <span>Exercises</span>
          </a>
        </li>
      </ul>
    </div>
    <configuration id="configView" observable="{ tabObservable }"></configuration>
    <content id="contentView" observable="{ tabObservable }" chart-observable="{ chartObservable }"></content>
    <exercises id="exercisesView" observable="{ tabObservable }" chart-observable="{ chartObservable }"></exercises>
    <chart-modal observable={ chartObservable }></chart-modal>
    <div class="container">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <button class="button is-success { is-loading: isSavingTutorial }" onclick={saveTutorial}>Save Current Tutorial State</button>
          </div>
          <div class="level-item">
            <p show={ saveTutorialSuccess } class="help has-text-grey">
              <span class="icon is-small has-text-success">
                <i class="fa fa-check"></i>
              </span>
              Tutorial State Saved - { currentTime }
            </p>
            <p show={ saveTutorialFailed } class="help has-text-grey">
              <span class="icon is-small has-text-danger">
                <i class="fa fa-times"></i>
              </span>
              Unfortunately, we failed to save the current tutorial state. Please try again.
            </p>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <p>
              <a class="button is-info" onclick={ previewTutorial }>Save & Preview</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
  <script>
    var self = this
    this.loadingText = 'Retrieving last saved state. Hang on.'
    this.isLoading = true
    this.tabObservable = riot.observable()
    this.sessionObservable = riot.observable()
    this.chartObservable = riot.observable()
    this.sessionExpiry = 0
    this.sessionExpiryTimer
    this.tutorialName = this.opts.tutorialName || ''
    this.currentTime = ''
    this.showedPreviewConfirmation = false
    this.isSavingTutorial = false
    this.saveTutorialSuccess = false
    this.saveTutorialFailed = false

    this.on('mount', function () {
      this.initLeavePrompt()
      const url = '/v1/tutorial/' + this.tutorialName
      $.get(url, function(result) {
        self.tags.configuration.set(result.data.config),
        self.tags.content.set(result.data.content),
        self.tags.exercises.set(result.data.exercises)
        self.isLoading = false
        self.sessionExpiry = result.metadata.expiresOn
        self.initSessionExpiryTimer()
        self.update()
        self.pickConfiguration()
      })
      .fail(function (res){
        const error = res.responseJSON
        handleError(error)
      })

      this.sessionObservable.on('saveTutorial', function(){
        self.saveState(function(err, result) {
            if (err){
              self.sessionObservable.trigger('saveFailed')
            }
            else{
              self.sessionObservable.trigger('saveSuccess')
            }
            self.update()
        })
      })

    })

    initLeavePrompt(){
      $(window).bind('beforeunload', function(){
        return 'Please make sure you save your changes before navigating away from this page.';
      });
    }

    disableLeavePrompt(){
      $(window).unbind('beforeunload')
    }

    initSessionExpiryTimer(){
      const triggerTime = 300 //seconds 
      var currentTime = moment.utc().unix()
      this.sessionExpiryTimer = setInterval(function() {
        const timeRemaining = self.sessionExpiry - currentTime
        if (timeRemaining <= triggerTime){
          self.sessionObservable.trigger('sessionExpiringSoon', timeRemaining)
          self.killSessionExpiryTimer()
        }
        currentTime += 1

      }, 1000)
    }

    killSessionExpiryTimer(){
      clearInterval(this.sessionExpiryTimer)
    }

    pickConfiguration() {
      $("#configTab").addClass("is-active")
      $("#contentTab").removeClass("is-active")
      $("#exercisesTab").removeClass("is-active")
      this.tabObservable.trigger('show', 'config')
    }
    pickContent() {
      $("#configTab").removeClass("is-active")
      $("#contentTab").addClass("is-active")
      $("#exercisesTab").removeClass("is-active")
      this.tabObservable.trigger('show', 'content')
    }
    pickExercises() {
      $("#configTab").removeClass("is-active")
      $("#contentTab").removeClass("is-active")
      $("#exercisesTab").addClass("is-active")
      this.tabObservable.trigger('show', 'exercises')

    }

    previewTutorial(){
      return this.saveState(function(err, result) {
        if (err){
          const skipSaving = confirm('Unfortunately, we were unable to save the current state of the tutorial. Would you like to preview your last saved state ? \n Note that your current changes will be lost.')
          if(skipSaving){
            window.location.href = '/preview/' + self.tutorialName
          }
          return
        }
        self.disableLeavePrompt()
        self.update()
        window.location.href = '/preview/' + self.tutorialName
        
      })
    }

    saveTutorial(){
      this.saveState()
    }

    saveState(callback) {
      this.isSavingTutorial = true
      this.saveTutorialSuccess = false
      this.saveTutorialFailed = false
      const data = {
        tutorialName: this.tutorialName,
        config: this.tags.configuration.get(),
        content: this.tags.content.get(),
        exercises: this.tags.exercises.get()
      }
      const url = '/v1/save/tutorial'
      $.ajax({
        url: url,
        type: 'PUT',
        data: { data: JSON.stringify(data) },
        success: function (result) {
          self.isSavingTutorial = false
          self.saveTutorialSuccess = true
          self.saveTutorialFailed = false
          self.currentTime = new Date().toLocaleTimeString()
          self.update()
          if (callback){
            callback(null, { status: 200 })
          }
        }
        })
        .fail(function (res){
          self.isSavingTutorial = false
          self.saveTutorialSuccess = false
          self.saveTutorialFailed = true
          self.update()
          const error = res.responseJSON
          if (callback){
            callback(error, null)
          }
      })
    }
  </script>
</builder>