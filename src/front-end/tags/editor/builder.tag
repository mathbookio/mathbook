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
    <configuration id="config"></configuration>
    <content id="content"></content>
    <exercises id="exercises"></exercises>
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
    var that = this
    this.loadingText = 'Retrieving last saved state. Hang on.'
    this.isLoading = true
    this.sessionObservable = riot.observable()
    this.sessionExpiry = 0
    this.sessionExpiryTimer
    this.tutorialName = this.opts.tutorialName || ''
    this.currentTime = ''
    this.showedPreviewConfirmation = false
    this.isSavingTutorial = false
    this.saveTutorialSuccess = false
    this.saveTutorialFailed = false

    this.on('mount', function () {
      //this.initLeavePrompt()
      this.pickConfiguration();
      const url = '/v1/tutorial/' + this.tutorialName
      $.get(url, function(result) {
        console.log('getTutorialData data', result)
        that.tags.configuration.set(result.data.config),
        that.tags.content.set(result.data.content),
        that.tags.exercises.set(result.data.exercises)
        that.isLoading = false
        that.sessionExpiry = result.metadata.expiresOn
        that.initSessionExpiryTimer()
        that.update()
      })
      .fail(function (res){
        const error = res.responseJSON
        handleError(error)
      })

      this.sessionObservable.on('saveTutorial', function(){
        that.saveState(function(err, result) {
            if (err){
              that.sessionObservable.trigger('saveFailed')
            }
            else{
              that.sessionObservable.trigger('saveSuccess')
            }
            that.update()
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
        const timeRemaining = that.sessionExpiry - currentTime
        //console.log("timeRemaining", timeRemaining, "currentTime", currentTime, "sessionExpiry", that.sessionExpiry)
        if (timeRemaining <= triggerTime){
          that.sessionObservable.trigger('sessionExpiringSoon', timeRemaining)
          that.killSessionExpiryTimer()
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
      $("#content").hide();
      $("#exercises").hide();
      $("#config").show();
    }
    pickContent() {
      $("#configTab").removeClass("is-active")
      $("#contentTab").addClass("is-active")
      $("#exercisesTab").removeClass("is-active")
      $("#content").show();
      $("#exercises").hide();
      $("#config").hide();
    }
    pickExercises() {
      $("#configTab").removeClass("is-active")
      $("#contentTab").removeClass("is-active")
      $("#exercisesTab").addClass("is-active")
      $("#content").hide();
      $("#exercises").show();
      $("#config").hide();
    }

    previewTutorial(){
      return this.saveState(function(err, result) {
        if (err){
          const skipSaving = confirm('Unfortunately, we were unable to save the current state of the tutorial. Would you like to preview your last saved state ? \n Note that your current changes will be lost.')
          if(skipSaving){
            window.location.href = '/preview/' + that.tutorialName
          }
          return
        }
        that.disableLeavePrompt()
        that.update()
        window.location.href = '/preview/' + that.tutorialName
        
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
      console.log(data)
      const url = '/v1/save/tutorial'
      $.ajax({
        url: url,
        type: 'PUT',
        data: { data: JSON.stringify(data) },
        success: function (result) {
          console.log('saved tutorial successfully')
          that.isSavingTutorial = false
          that.saveTutorialSuccess = true
          that.saveTutorialFailed = false
          that.currentTime = new Date().toLocaleTimeString()
          that.update()
          if (callback){
            callback(null, { status: 200 })
          }
        }
        })
        .fail(function (res){
          that.isSavingTutorial = false
          that.saveTutorialSuccess = false
          that.saveTutorialFailed = true
          that.update()
          const error = res.responseJSON
          console.log(error)
          if (callback){
            callback(error, null)
          }
      })
    }
  </script>
</builder>