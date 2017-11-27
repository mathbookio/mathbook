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
      <div show={ tutorials.length === 0 } class="column has-text-centered has-text-grey">
        <p>
          No Tutorials found! You should create one 
          <span class="icon is-small">
            <i class="fa fa-smile-o"></i>
          </span>
        </p>
      </div>
      <div show={ loadingTutorials } class="column has-text-centered has-text-grey">
        <p> Locating your Tutorials 
          <span class="icon is-medium">
            <i class="fa fa-cog fa-spin"></i>
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
                    <span show={ state === 'changesRequested' } class="tag is-warning" title="Please click on the external link icon for more context">Changes Requested</span>
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
                  <i class="fa fa-trash-o"></i>
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
    var that = this
    this.dashboardObservable = riot.observable()
    this.loadingTutorials = false
    this.tutorials
    $(document).ready(function() {
      that.loadingTutorials = true
      that.update()
      $.get('/v1/tutorials', function (result) {
        console.log('result from /v1/tutorials', result)
        that.loadingTutorials = false
        that.tutorials = result.tutorials
        that.update()
      })
    })

    editTutorial(e) {
      console.log('editing tutorial with id', e.item)
      window.location.href = '/editor/' + e.item.name
    }

    previewTutorial(e){
      console.log('editing tutorial with id', e.item)
      window.location.href = '/preview/' + e.item.name 
    }

    openSubmitTutorialModal(e) {
      console.log('submitTutorialName', this.submitTutorialName)
      const submitTutorialName = e.item.name
      this.dashboardObservable.trigger('openSubmitModal', submitTutorialName)
    }

    openDeleteTutorialModal(e) {
      const tutorialName = e.item.name
      console.log('deleteTutorialName', tutorialName)
      this.dashboardObservable.trigger('openDeleteModal', tutorialName)
    }

    openCreateTutorialModal() {
      this.dashboardObservable.trigger('openCreateModal')
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