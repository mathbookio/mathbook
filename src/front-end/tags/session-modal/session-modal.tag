<session-modal>
      <div class="modal {is-active: showSessionModal}">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Heads Up</p>
          </header>
          <section class="modal-card-body">
            <div class="content">
              <p hide={ sessionExpired }>
                Hey there,
                <br/>
                Your session will expire in <strong>{ timeRemaining }</strong>. Currently, all sessions expire after 24 hours. 
                Please save your changes and log back in to continue working on your tutorial.
              </p>
              <p show={ sessionExpired }>
                Your Session has now expired. You are no longer able to save your changes. 
                <span class="icon"><i class="fa fa-frown-o"></i></span>
                <br/>
                <a href="/login">Click here to visit the Login page.</a>
              </p>
              <p show={ savingComplete }>
                <span class="icon has-text-success"><i class="fa fa-check"></i></span> 
                Successfully Saved Tutorial State. You will be redirected to the Login page momentarily.
              </p>
              <p show={ savingFailed }> 
                <span class="icon has-text-danger"><i class="fa fa-times"></i></span> 
                Failed to Save Tutorial State. You will be redirected to the Login page momentarily.
              </p>
            </div>
          </section>
          <footer class="modal-card-foot">
            <button disabled={ sessionExpired } class="button is-info { is-loading: isSaving }" onclick={ save }>Save and Go to Login Page</button>
            <button disabled={ sessionExpired } class="button is-white" onclick={ close }>Got it</button>
          </footer>
        </div>
      </div>
    </div>
  <script>
    var that = this
    this.observable = this.opts.observable
    this.showCreateTutorialModal = false
    this.isSaving = false
    this.savingComplete = false
    this.savingFailed = false
    this.countdown
    this.sessionExpired = false

    this.on('mount', function(){
      this.observable.one('sessionExpiringSoon', function(expireTime){
        that.open(expireTime)
        that.update()
      })

      this.observable.on('saveSuccess', function() {
        that.isSaving = false
        that.savingComplete = true
        that.savingFailed = false
        that.update()
        setTimeout(function() {
          that.killCountdown()
          that.update()
          that.login()
        }, 3500)
      })

      this.observable.on('saveFailed', function() {
        that.isSaving = false
        that.savingComplete = false
        that.savingFailed = true
        that.update()
        setTimeout(function() {
          that.killCountdown()
          that.update()
          that.login()
        }, 3500)
      })
    })

    open(expireTime){
      // we don't want to show the popup that prevents the user from accidentally leaving the page. 
      // the session modal will need to redirect if the user decides to save and log back in.
      $(window).unbind('beforeunload')
      this.timeRemaining = this.formatExpireTime(expireTime)
      this.initCountdown(expireTime)
      this.showSessionModal = true
    }

    close(){
      $(window).bind('beforeunload', function(){
        return 'Please make sure you save your changes before navigating away from this page.';
      })
      this.showSessionModal = false
      this.killCountdown()
    }

    save(){
      this.observable.trigger('saveTutorial')
      this.isSaving = true
    }

    initCountdown(startTime){
      var expireTime = startTime
      this.countdown = setInterval(function (){
        that.timeRemaining = that.formatExpireTime(expireTime)
        if (expireTime <= 0){
          that.sessionExpired = true
          that.killCountdown()
          that.update()
          return
        }
        expireTime -= 1
        that.update()
      }, 1000)
    }

    killCountdown(){
      clearInterval(this.countdown)
    }

    formatExpireTime(expireTime){
      if (expireTime <= 0){
        return 0
      }
      let time = ""
      const minutes = moment.duration(expireTime, 'seconds').minutes()
      const seconds = moment.duration(expireTime, 'seconds').seconds()
      if (minutes > 0){
        time += minutes + " minute(s) and "
      }
      if (seconds >= 0){
        time += seconds + " seconds"
      }
      return time
    }

    login(){
      window.location.href = "/login"
    }

  </script>
</session-modal>