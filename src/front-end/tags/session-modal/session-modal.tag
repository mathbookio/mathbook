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
                <span class="icon"><i class="far fa-frown"></i></span>
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
    var self = this
    this.observable = this.opts.observable
    this.isSaving = false
    this.savingComplete = false
    this.savingFailed = false
    this.countdown
    this.sessionExpired = false

    this.on('mount', function(){
      this.observable.one('sessionExpiringSoon', function(expireTime){
        self.open(expireTime)
        self.update()
      })

      this.observable.on('saveSuccess', function() {
        self.isSaving = false
        self.savingComplete = true
        self.savingFailed = false
        self.update()
        setTimeout(function() {
          self.killCountdown()
          self.update()
          self.login()
        }, 3500)
      })

      this.observable.on('saveFailed', function() {
        self.isSaving = false
        self.savingComplete = false
        self.savingFailed = true
        self.update()
        setTimeout(function() {
          self.killCountdown()
          self.update()
          self.login()
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
        self.timeRemaining = self.formatExpireTime(expireTime)
        if (expireTime <= 0){
          self.sessionExpired = true
          self.killCountdown()
          self.update()
          return
        }
        expireTime -= 1
        self.update()
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