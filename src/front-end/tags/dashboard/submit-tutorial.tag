<submit-tutorial>
  <div class="modal {is-active: showSubmitTutorialModel}">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Submit Tutorial</p>
          <button class="delete" aria-label="close" onclick={ closeSubmitTutorialModal }></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label>Tutorial Description (Optional)</label>
            <div class="control">
              <textarea ref="submitTutorialDescription" class="textarea" placeholder="feel free use Markdown" />
            </div>
            <p class="help has-text-grey">
              Providing a description for the tutorial is optional, however it is usually good practice to include a description of what
              your tutorial contains so that the contributors that review your tutorial have an idea of what to expect.
            </p>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button disabled={ submitSuccess } class="button is-success { is-loading: isSubmitting }" onclick={ submitTutorial }>Submit</button>
          <button class="button" onclick={ closeSubmitTutorialModal }>Close</button>
          <p show={ submitSuccess } class="help">
            <span class="icon is-small has-text-success">
              <i class="fa fa-check"></i>
            </span>
            Congratulations, your tutorial was successfully submitted. You can view the submission <a href={ pullRequestUrl } target="_blank">here</a>
            This page will now refresh in a moment.
          </p>
          <p show={ submitFailed } class="help">
            <span class="icon is-small has-text-danger">
              <i class="fa fa-times"></i>
            </span>
            Unfortunately, we were unable to submit your tutorial for the following reason, <strong>{ failedMessage }</strong>
          </p>
        </footer>
      </div>
    </div>
  <script>
    var that = this
    this.tutorialName = ''
    this.observable = this.opts.observable
    this.showSubmitTutorialModel = false
    this.submitSuccess = false
    this.submitFailed = false
    this.isSubmitting = false
    this.submitComplete = false
    this.failedMessage = ''

    this.on('mount', function(){
      this.observable.on('openSubmitModal', function(tutorialName){
        that.openSubmitModal(tutorialName)
        that.update()
      })
    })

    openSubmitModal(tutorialName){
      this.tutorialName = tutorialName
      this.showSubmitTutorialModel = true
    }

    submitTutorial() {
      const tutorialName = this.tutorialName
      const submitDescription = this.refs.submitTutorialDescription.value || ''
      this.isSubmitting = true
      const url = '/v1/submit/tutorial'
      $.ajax({
        url: url,
        type: 'PUT',
        data: {
          tutorialName: tutorialName,
          submitDescription: submitDescription
        },
        success: function (result) {
          const pullRequestUrl = result.pullRequestUrl
          that.submitTutorialSucceeded(pullRequestUrl)
          that.update()
          setTimeout(function () {
            window.location.reload()
          }, 4500)
        }
      })
      .fail(function(res) {
        const error = res.responseJSON
        console.log(error)
        that.submitTutorialFailed(error.message)
        that.update()
      })
    }

    submitTutorialSucceeded(pullRequestUrl){
      this.submitSuccess = true
      this.submitFailed = false
      this.isSubmitting = false
      this.submitComplete = true
      this.pullRequestUrl = pullRequestUrl
      this.failedMessage = ''
    }

    submitTutorialFailed(message){
      this.submitSuccess = false
      this.submitFailed = true
      this.isSubmitting = false
      this.submitComplete = false
      this.pullRequestUrl = ''
      this.failedMessage = message
    }

    closeSubmitTutorialModal() {
      this.showSubmitTutorialModel = false
      this.cleanup()
    }

    cleanup(){
      this.tutorialName = ''
      this.submitSuccess = false
      this.submitFailed = false
      this.isSubmitting = false
      this.submitComplete = false
    }

  </script>
</submit-tutorial>