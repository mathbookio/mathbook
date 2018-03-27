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
    <auto-save></auto-save>
    <configuration id="configView" observable="{ tabObservable }"></configuration>
    <content id="contentView" observable="{ tabObservable }" chart-observable="{ chartObservable }"></content>
    <exercises id="exercisesView" observable="{ tabObservable }" chart-observable="{ chartObservable }"></exercises>
    <chart-modal observable={ chartObservable }></chart-modal>
    <div class="section-padding container">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
          <div class="field">
            <div class="control">
              <button class="button is-success { is-loading: updateState === updateTutorialStates.Updating }" onclick={ updateTutorial }>Update Tutorial State</button>
              <p class="help">push changes to a submitted tutorial.</p>
            </div>
          </div>
          </div>
          <div class="level-item">
            <p show={ updateState === updateTutorialStates.Updated } class="help has-text-grey">
              <span class="icon is-small has-text-success">
                <i class="fa fa-check"></i>
              </span>
              Tutorial State Saved - { currentTime }
            </p>
            <p show={ updateState === updateTutorialStates.Failed } class="help has-text-grey">
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
              <a class="button is-info" onclick={ previewTutorial }>Preview Tutorial</a>
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
    this.updateTutorialStates = {
      Updated: 'updated',
      Updating: 'updating',
      Failed: 'failed',
      None: 'none'
    }
    this.updateState = this.updateTutorialStates.None

    this.on('mount', function () {
      const url = '/v1/tutorial/' + this.tutorialName
      $.get(url, function(result) {
        self.tags.configuration.set(result.data.config),
        self.tags.content.set(result.data.content),
        self.tags.content.setWorkInProgress(result.data.contentWip),
        self.tags.exercises.set(result.data.exercises)
        self.tags.exercises.setWorkInProgress(result.data.exerciseWip)
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
      window.location.href = '/preview/' + self.tutorialName
    }

    updateTutorial(){
      this.updateState = this.updateTutorialStates.Updating
      const data = this.get()
      const url = '/v1/save/tutorial'
      $.ajax({
        url: url,
        type: 'PUT',
        data: { data: JSON.stringify(data) },
        success: function (result) {
          self.updateState = self.updateTutorialStates.Updated
          self.currentTime = new Date().toLocaleTimeString()
          self.update()
        }
        })
        .fail(function (res){
          self.updateState = self.updateTutorialStates.Failed
          self.update()
      })
    }

    get(includeWorkInProgress = false){
      return {
        tutorialName: self.tutorialName,
        config: self.tags.configuration.get(),
        content: self.tags.content.get(),
        exercises: self.tags.exercises.get(),
        contentWip: includeWorkInProgress ? self.tags.content.getWorkInProgress(): undefined,
        exerciseWip: includeWorkInProgress ? self.tags.exercises.getWorkInProgress(): undefined
      }
    }
  </script>
</builder>