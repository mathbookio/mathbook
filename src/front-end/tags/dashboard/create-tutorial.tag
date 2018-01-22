<create-tutorial>
      <div class="modal {is-active: showCreateTutorialModal}">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Create A Tutorial</p>
            <button class="delete" aria-label="close" onclick={ closeModal }></button>
          </header>
          <section class="modal-card-body">
            <div class="field">
              <label>Tutorial Name</label>
              <div class="control">
                <input ref="tutorialName" type="text" class="input" placeholder="e.g. ele-algebra-factoring" />
              </div>
              <p show={ invalidTutorialName } class="help has-text-danger">
                The name you have chosen is invalid. Please refer to the criteria to see what constitutes a valid name.
              </p>
              <p class="help">
                <span class="has-text-grey">
                  The tutorial name will be used to identify the tutorial for you and other contributors of Mathbook so make sure it's representative
                  of the tutorial you are going to create.
                </span>
                <br/>
                <br/>
                <strong>Criteria:</strong> between 10 to 30 characters restricted to Alphanumeric and dashes ( - ) only.
                <br/>
                <br/>
                <strong>Note:</strong> Admins reserve the right to delete the tutorial if the name contains anything offensive or
                inappropriate.
              </p>
            </div>
          </section>
          <footer class="modal-card-foot">
            <button class="button is-success { is-loading: isCreating }" onclick={ createTutorial }>Create</button>
            <button class="button" onclick={ closeModal }>Cancel</button>
            <p show={ createSuccess } class="help">
              <span class="icon is-small has-text-success">
                <i class="fa fa-check"></i>
              </span>
              Congratulations, your tutorial was successfully created. You will be redirected momentarily.
            </p>
            <p show={ createFailed } class="help">
              <span class="icon is-small has-text-danger">
                <i class="fa fa-times"></i>
              </span>
              Unfortunately, we were unable to create the tutorial for the following reason, <strong>{ createFailedMessage }</strong>
            </p>
          </footer>
        </div>
      </div>
    </div>
  <script>
    var self = this
    this.observable = this.opts.observable
    this.showCreateTutorialModal = false
    this.invalidTutorialName = false
    this.isCreating = false
    this.createSuccess = false
    this.createFailed = false
    this.createFailedMessage = ''

    this.on('mount', function(){
      this.observable.on('openCreateModal', function(){
        self.open()
        self.update()
      })
    })

    open(){
      this.showCreateTutorialModal = true
    }

    closeModal(){
      this.showCreateTutorialModal = false
      this.cleanup()
    }

    cleanup(){
      this.invalidTutorialName = false
      this.isCreating = false
      this.createFailed = false
      this.createFailedMessage = ''
      this.refs.tutorialName.value = ''
    }

    createTutorial() {
      const tutorialName = this.refs.tutorialName.value
      if (this.tutorialNameInvalid(tutorialName)) {
        this.invalidTutorialNameEntered()
        return
      }
      this.prepareToCreateTutorial()
      const url = '/v1/create'
      $.post(url, {
        'branchName': tutorialName
      }, function (result) {
        self.createTutorialSucceeded()
        self.update()
        setTimeout(function () {
          window.location.href = '/editor/' + tutorialName
        }, 2500)
      })
      .fail(function(error) {
        let message = ''
        if (error.status === 409){
          message = 'The tutorial name is already in use. Please create a different name.'
        }
        else{
          message = 'Uh-oh something broke on the server side. Please try again.'
        }
        self.createTutorialFailed(message)
        handleError(error)
        self.update()
      })
    }

    invalidTutorialNameEntered(){
      this.invalidTutorialName = true
      this.isCreating = false
      this.createSuccess = false
    }

    prepareToCreateTutorial(){
      this.invalidTutorialName = false
      this.createSuccess = false
      this.isCreating = true
      this.createFailed = false
      this.createFailedMessage = ''
    }

    createTutorialSucceeded(){
      this.isCreating = false
      this.createSuccess = true
      this.createFailed = false
      this.createFailedMessage = ''
    }

    createTutorialFailed(message){
      this.isCreating = false
      this.createSuccess = false
      this.createFailed = true
      this.createFailedMessage = message
    }

    tutorialNameInvalid(tutorialName) {
      var namePattern = new RegExp(/^[a-zA-Z0-9-]{10,30}$/)
      return (!namePattern.test(tutorialName))
    }
  </script>
</create-tutorial>