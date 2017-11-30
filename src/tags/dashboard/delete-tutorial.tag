<delete-tutorial>
  <div class="modal {is-active: showDeleteTutorialModal}">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Delete Tutorial</p>
          <button class="delete" aria-label="close" onclick={ closeModal }></button>
        </header>
        <section class="modal-card-body">
          <p>
            Are you sure you want to delete the tutorial <strong>{ tutorialName }</strong> ? This action cannot be undone. If so, please enter the tutorial name
            to confirm the delete operation.
          </p>
          <br/>
          <div class="field">
            <label>Tutorial Name</label>
            <div class="control">
              <input id="deleteTutorialName" ref="tutorialNameInput" type="text" class="input" />
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button disabled={ !safeToDelete } class="button is-danger { is-loading: isDeleting }" onclick={ deleteTutorial }>Delete Tutorial</button>
          <button class="button" onclick={ closeModal }>Cancel</button>
          <p show={ deleteSuccess } class="help">
            <span class="icon is-small has-text-success">
              <i class="fa fa-check"></i>
            </span>
            The tutorial was successfully deleted. The current page will refresh momentarily.
          </p>
          <p show={ deleteFailed } class="help">
            <span class="icon is-small has-text-danger">
              <i class="fa fa-times"></i>
            </span>
            Unfortunately, we were unable to delete the tutorial at this time because of the following reason, <strong>{ deleteFailedMessage }</strong>
          </p>
        </footer>
      </div>
    </div>
  <script>
    var that = this
    this.observable = this.opts.observable
    this.showDeleteTutorialModal = false
    this.safeToDelete = false
    this.isDeleting = false
    this.tutorialName = ''
    this.deleteSuccess = false
    this.deleteFailed = false
    this.deleteFailedMessage = ''
    
    this.on('mount', function() {

    this.observable.on('openDeleteModal', function(tutorialName){
      that.open(tutorialName)
      that.update()
    })

    $('#deleteTutorialName').on('input', function(e) {
      var inputTutorialName = e.target.value
      //console.log('input tutorial name', inputTutorialName)
      //console.log('that.tutorialName', that.tutorialName)
      if (inputTutorialName === that.tutorialName){
        that.safeToDelete = true
        that.update()
        return
      }
      that.safeToDelete = false
      that.update()
    })

    })

    open(tutorialName){
      this.tutorialName = tutorialName
      this.showDeleteTutorialModal = true
    }

    closeModal() {
      this.showDeleteTutorialModal = false
      this.cleanup()
    }

    cleanup(){
      this.safeToDelete = false
      this.tutorialName = ''
      this.isDeleting = false
      this.deleteSuccess = false
      this.deleteFailed = false
      this.deleteFailedMessage = ''
      this.refs.tutorialNameInput.value = ''
    }

    prepareToDelete(){
      this.isDeleting = true
      this.deleteSuccess = false
      this.deleteFailed = false
      this.deleteFailedMessage = ''
    }

    deleteTutorial() {
      this.prepareToDelete()
      const url = '/v1/remove/tutorial'
      $.ajax({
        url: url,
        type: 'DELETE',
        data: {
          tutorialName: this.tutorialName
        },
        success: function (result) {
          that.deleteTutorialSucceeded()
          that.update()
          setTimeout(function () {
            window.location.reload()
          }, 2500)
        }
      })
      .fail(function(res) {
        const error = res.responseJSON
        console.error(error)
        that.deleteTutorialFailed(error.message)
        that.update()
      })
    }

    deleteTutorialSucceeded(){
      that.isDeleting = false
      that.deleteSuccess = true
      that.deleteFailed = false
      that.deleteFailedMessage = ''
    }

    deleteTutorialFailed(message){
      that.isDeleting = false
      that.deleteSuccess = false
      that.deleteFailed = true
      that.deleteFailedMessage = message
    }

  </script>
</delete-tutorial>