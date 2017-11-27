<dashboard>
  <style>
    .button-padding {
      padding-right: 12px;
    }

    .lastEdited {
      cursor: help;
    }
  </style>
  <section class="section">
    <div class="container">
      <div class="content">
        <a class="button is-success" onclick={ openTutorialModal }>Create Tutorial</a>
      </div>
      <div show={ tutorials.length === 0 } class="column has-text-centered has-text-grey">
        <p>
          No Tutorials found! You should create one 
          <span class="icon is-small">
            <i class="fa fa-smile-o"></i>
          </span>
        </p>
      </div>
      <div class="columns" each={ tutorials }>
        <div class="column">
          <div class="card">
            <header class="card-header">
              <div class="level is-full-width">
                <div class="level-left">
                  <div class="level-item">
                    <p class="card-header-title">Tutorial:</p>
                  </div>
                  <div class="level-item">
                    <p>{ name }</p>
                  </div>
                  <div class="level-item">
                    <a href={ pullRequestUrl } show={ state !== null } target="_blank"> 
                      <span class="icon is-small"><i class="fa fa-external-link"></i></span>
                    </a>
                  </div>
                </div>
                <div class="level-right">
                  <div class="level-item">
                    <span show={ state === 'open' } class="tag is-info">Submitted / Under Review</span>
                    <span show={ state === 'changesRequested' } class="tag is-warning">Changes Requested</span>
                    <span show={ state === 'approved' } class="tag is-success">Approved / Awaiting Merge</span>
                    <span show={ state === 'merged' } class="tag is-success">Merged</span>
                    <span show={ state === null } class="tag">In Progress</span>
                    <span show={ state === 'closed' } class="tag is-danger">Closed</span>
                  </div>
                  <div class="level-item">
                    <p class="content lastEdited" title={ formatDate(lastEdited) }>
                      <span class="icon is-small">
                        <i class="fa fa-clock-o"></i>
                      </span> { formatDateFromNow(lastEdited) }</p>
                  </div>
                </div>
              </div>
            </header>
            <footer class="card-footer">
              <a show={ state === null || state === 'closed' } class="card-footer-item" onclick="{ parent.openSubmitTutorialModal }">
                <span class="icon is-small">
                  <i class="fa fa-send"></i>
                </span>
              </a>
              <a class="card-footer-item edit" onclick="{ parent.editTutorial }">
                <span class="icon is-small">
                  <i class="fa fa-pencil"></i>
                </span>
              </a>
              <a class="card-footer-item edit" onclick="{ parent.previewTutorial }">
                <span class="icon is-small">
                  <i class="fa fa-file"></i>
                </span>
                <span> </span>
                <span class="icon is-small">
                  <i class="fa fa-search"></i>
                </span>
              </a>
              <a class="card-footer-item delete-button" onclick={ openDeleteTutorialModal }>
                <span class="icon is-small">
                  <i class="fa fa-times"></i>
                </span>
              </a>
            </footer>
          </div>
        </div>
      </div>
      <!--  CREATE TUTORIAL MODAL  -->
      <div class="modal {is-active: showCreateTutorialModel}">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Create A Tutorial</p>
            <button class="delete" aria-label="close" onclick={ closeTutorialModal }></button>
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
            <button class="button is-success { is-loading: isCreatingTutorial }" onclick={ createTutorial }>Create</button>
            <button class="button" onclick={ closeTutorialModal }>Cancel</button>
            <p show={ createTutorialComplete } class="help">
              <span class="icon is-small has-text-success">
                <i class="fa fa-check"></i>
              </span>
              Congratulations, your tutorial was successfully created. You will be redirected momentarily.
            </p>
          </footer>
        </div>
      </div>
    </div>
    <!--  SUBMIT TUTORIAL MODAL  -->
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
          <button disabled={ submitTutorialSuccess } class="button is-success { is-loading: isSubmittingTutorial }" onclick={ submitTutorial }>Submit</button>
          <button class="button" onclick={ closeSubmitTutorialModal }>Close</button>
          <p show={ submitTutorialSuccess } class="help">
            <span class="icon is-small has-text-success">
              <i class="fa fa-check"></i>
            </span>
            Congratulations, your tutorial was successfully submitted. View it <a href={ pullRequestUrl } target="_blank">here</a>
          </p>
        </footer>
      </div>
    </div>
    <!--  DELETE TUTORIAL MODAL  -->
    <div class="modal {is-active: showDeleteTutorialModal}">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Delete Tutorial</p>
          <button class="delete" aria-label="close" onclick={ closeDeleteTutorialModal }></button>
        </header>
        <section class="modal-card-body">
          <p>
            Are you sure you want to delete the tutorial <strong>{ deleteTutorialItemName }</strong> ? This action cannot be undone. If so, please enter the tutorial name
            to confirm the delete operation.
          </p>
          <br/>
          <div class="field">
            <label>Tutorial Name</label>
            <div class="control">
              <input id="deleteTutorialName" type="text" class="input" />
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button disabled={ !safeToDeleteTutorial } class="button is-danger { is-loading: isDeletingTutorial }" onclick={ deleteTutorial }>Delete Tutorial</button>
          <button class="button" onclick={ closeDeleteTutorialModal }>Cancel</button>
          <p show={ deleteTutorialSuccess } class="help">
            <span class="icon is-small has-text-success">
              <i class="fa fa-check"></i>
            </span>
            The tutorial was successfully deleted. The current page will refresh momentarily.
          </p>
        </footer>
      </div>
    </div>
  </section>
  <script>
    var that = this
    this.showCreateTutorialModel = false
    this.showSubmitTutorialModel = false
    this.submitTutorialSuccess = false
    this.submitTutorialName = ''
    this.invalidTutorialName = false
    this.isCreatingTutorial = false
    this.createTutorialComplete = false
    this.submitTutorialItem
    this.isSubmittingTutorial = false
    this.submitTutorialComplete = false

    this.deleteTutorialItem
    this.safeToDeleteTutorial = false
    this.showDeleteTutorialModal = false
    this.isDeletingTutorial = false

    this.pullRequestUrl = ''
    this.tutorials = []
    $(document).ready(() => {
      $.get('/v1/tutorials', function (result) {
        console.log('result from /v1/tutorials', result)
        that.tutorials = result.tutorials
        that.update()
      })


    })

    this.on('mount', function() {

    $('#deleteTutorialName').on('input', function(e) {
      var inputTutorialName = e.target.value
      console.log('input tutorial name', inputTutorialName)
      console.log('that.deleteTutorialItemName', that.deleteTutorialItemName)
      if (inputTutorialName === that.deleteTutorialItemName){
        that.safeToDeleteTutorial = true
        that.update()
        return
      }
      that.safeToDeleteTutorial = false
      that.update()

    });

    })
    createTutorial() {
      const tutorialName = this.refs.tutorialName.value
      if (this.tutorialNameInvalid(tutorialName)) {
        console.log('tutorial Name invalid', tutorialName)
        this.invalidTutorialName = true
        this.isCreatingTutorial = false
        this.createTutorialComplete = false
        return
      }
      this.invalidTutorialName = false
      this.createTutorialComplete = false
      this.isCreatingTutorial = true
      const url = '/v1/fork'
      $.post(url, {
        'branchName': tutorialName
      }, function (result) {
        console.log("result from post", result)
        that.isCreatingTutorial = false
        that.createTutorialComplete = true
        that.update()
        setTimeout(function () {
          console.log("tutorial created successfully")
          window.location.href = '/editor/' + tutorialName
        }, 2500)
      })
    }

    tutorialNameInvalid(tutorialName) {
      var namePattern = new RegExp(/^[a-zA-Z0-9-]{10,30}$/)
      return (!namePattern.test(tutorialName))
    }

    submitTutorial() {
      const tutorialName = this.submitTutorialName
      const submitDescription = this.refs.submitTutorialDescription.value || ''
      console.log('submitting tutorial with id', tutorialName)
      this.isSubmittingTutorial = true
      const url = '/v1/submit/tutorial'
      $.ajax({
        url: url,
        type: 'PUT',
        data: {
          tutorialName: tutorialName,
          submitDescription: submitDescription
        },
        success: function (result) {
          console.log('submitted the tutorial with id', tutorialName)
          that.isSubmittingTutorial = false
          that.submitTutorialSuccess = true
          that.submitTutorialItem.isSubmitted = true
          that.pullRequestUrl = result.pullRequestUrl
          that.update()
        }
      })
    }
    editTutorial(e) {
      console.log('editing tutorial with id', e.item)
      window.location.href = '/editor/' + e.item.name
    }

    previewTutorial(e){
      console.log('editing tutorial with id', e.item)
      window.location.href = '/preview/' + e.item.name 
    }

    deleteTutorial() {
      this.isDeletingTutorial = true
      this.deleteTutorialSuccess = false
      const url = '/v1/remove/tutorial'
      $.ajax({
        url: url,
        type: 'DELETE',
        data: {
          tutorialName: this.deleteTutorialItemName
        },
        success: function (result) {
          that.isDeletingTutorial = false
          that.deleteTutorialSuccess = true
          that.update()
          setTimeout(function () {
            window.location.reload()
          }, 2500)
        }
      })
    }

    openSubmitTutorialModal(e) {
      this.showSubmitTutorialModel = true
      this.submitTutorialSuccess = false
      this.submitTutorialName = e.item.name
      this.submitTutorialItem = e.item
      console.log('submitTutorialName', this.submitTutorialName)
    }
    closeSubmitTutorialModal() {
      this.showSubmitTutorialModel = false
      this.submitTutorialSuccess = false
      this.submitTutorialName = ''
    }

    openDeleteTutorialModal(e) {
      this.showDeleteTutorialModal = true
      this.deleteTutorialSuccess = false
      this.deleteTutorialItemName = e.item.name
    }

    closeDeleteTutorialModal() {
      this.showDeleteTutorialModal = false
      this.deleteTutorialSuccess = false
      this.deleteTutorialItemName = undefined
    }

    openTutorialModal() {
      this.showCreateTutorialModel = true
    }
    closeTutorialModal() {
      this.showCreateTutorialModel = false
    }

    formatDateFromNow(timestamp) {
      console.log('timestamp', timestamp)
      return moment(timestamp).fromNow()
    }
    formatDate(timestamp) {
      console.log('timestamp', timestamp)
      return moment(timestamp).format('MMMM DD, YYYY HH:mm:ss')
    }
  </script>
</dashboard>