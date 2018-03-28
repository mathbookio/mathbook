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
        <a class="button is-success" onclick={ openCreateTutorialModal }>Create Tutorial</a>
      </div>
      <div show={ noTutorialsFound } class="column has-text-centered has-text-grey">
        <p>
          No Tutorials found! You should create one 
          <span class="icon is-small">
            <i class="far fa-smile"></i>
          </span>
        </p>
      </div>
      <div show={ failedToGetTutorials } class="column has-text-centered has-text-grey">
        <p>
          Failed to retrieve tutorials for the following reason, { failedMessage }
          <span class="icon is-small">
            <i class="far fa-frown"></i>
          </span>
        </p>
      </div>
      <div show={ loadingTutorials } class="column has-text-centered has-text-grey">
        <p> Locating your Tutorials 
          <span class="icon is-medium">
            <i class="fas fa-cog fa-spin"></i>
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
                      <span class="icon is-small"><i class="fas fa-external-link-alt"></i></span>
                    </a>
                  </div>
                </div>
                <div class="level-right">
                  <div class="level-item">
                    <span show={ state === 'open' } class="tag is-info">Submitted / Under Review</span>
                    <span show={ state === 'changesRequested' } class="tag is-warning" title="Please click on the external link icon for more context">Changes Requested</span>
                    <span show={ state === 'approved' } class="tag is-success">Approved / Awaiting Merge</span>
                    <span show={ state === 'merged' } class="tag is-success">Merged</span>
                    <span show={ state === null } class="tag">In Progress</span>
                    <span show={ state === 'closed' } class="tag is-danger">Closed</span>
                  </div>
                  <div class="level-item">
                    <p class="content lastEdited" title={ formatDate(lastEdited) }>
                      <span class="icon is-small">
                        <i class="far fa-clock"></i>
                      </span> { formatDateFromNow(lastEdited) }</p>
                  </div>
                </div>
              </div>
            </header>
            <footer class="card-footer">
              <div show={ state === 'submitted' } class="card-footer-item has-text-grey">
                <span class="icon is-small">
                  <i class="fas fa-paper-plane"></i>
                </span>
              </div>
              <a show={ state === null || state === 'closed' } class="card-footer-item" title="Submit" onclick="{ parent.openSubmitTutorialModal }">
                <span class="icon is-small">
                  <i class="fas fa-paper-plane"></i>
                </span>
              </a>
              <a class="card-footer-item edit" title="Edit" onclick="{ parent.editTutorial }">
                <span class="icon is-small">
                  <i class="fas fa-pencil-alt"></i>
                </span>
              </a>
              <a class="card-footer-item edit" title="Preview" onclick="{ parent.previewTutorial }">
                <span class="icon is-small">
                  <i class="fas fa-file"></i>
                </span>
                <span> </span>
                <span class="icon is-small">
                  <i class="fa fa-search"></i>
                </span>
              </a>
              <a class="card-footer-item delete-button" title="Delete" onclick={ openDeleteTutorialModal }>
                <span class="icon is-small">
                  <i class="fas fa-trash-alt"></i>
                </span>
              </a>
            </footer>
          </div>
        </div>
      </div>
      <!--  CREATE TUTORIAL MODAL  -->
    <create-tutorial observable={ dashboardObservable }></create-tutorial>
    <!--  SUBMIT TUTORIAL MODAL  -->
    <submit-tutorial observable={ dashboardObservable }></submit-tutorial>
    <!--  DELETE TUTORIAL MODAL  -->
    <delete-tutorial observable={ dashboardObservable }></delete-tutorial>
  </section>
  <script>
    var self = this
    this.dashboardObservable = riot.observable()
    this.loadingTutorials = false
    this.noTutorialsFound = false
    this.tutorials = []
    this.failedToGetTutorials = false

    $(document).ready(function() {
      self.loadingTutorials = true
      self.update()
      $.get('/v1/tutorials', function (result) {
        self.succeededRequest()
        if(Array.isArray(result.data.tutorials) && result.data.tutorials.length === 0){
          self.noTutorialsFound = true
        }
        else{
          self.noTutorialsFound = false
        }
        self.tutorials = result.data.tutorials

        self.update()
      })
      .fail(function(res) {
        const error = res.responseJSON
        console.error('something broke while getting tutorials', error)
        self.failedRequest(error.message)
        handleError(error)
        self.update()
      })
    })

    succeededRequest(){
      this.loadingTutorials = false
      this.failedToGetTutorials = false
      this.failedMessage = ''
    }

    failedRequest(message){
      this.loadingTutorials = false
      this.failedToGetTutorials = true
      this.failedMessage = message
    }

    editTutorial(e) {
      window.location.href = '/editor/' + e.item.name
    }

    previewTutorial(e){
      window.location.href = '/preview/' + e.item.name 
    }

    openSubmitTutorialModal(e) {
      const submitTutorialName = e.item.name
      this.dashboardObservable.trigger('openSubmitModal', submitTutorialName)
    }

    openDeleteTutorialModal(e) {
      const tutorialName = e.item.name
      this.dashboardObservable.trigger('openDeleteModal', tutorialName)
    }

    openCreateTutorialModal() {
      this.dashboardObservable.trigger('openCreateModal')
    }

    formatDateFromNow(timestamp) {
      return moment(timestamp).fromNow()
    }
    formatDate(timestamp) {
      return moment(timestamp).format('MMMM DD, YYYY HH:mm:ss')
    }
  </script>
</dashboard>