<submitted-tutorials>
    <section class="section">
      <div class="container">
        <div class="content">
          <loading-spinner loading-flag={ isLoading } text={ loadingText }></loading-spinner>
          <div hide={ isLoading }>
            <div show={ noTutorialsFound } class="column has-text-centered has-text-grey">
                <p>
                  There are no tutorials currently submitted for review. Please check back later 
                  <span class="icon is-small">
                    <i class="far fa-smile"></i>
                  </span>
                </p>
              </div>
              <div show={ failedToGetTutorials } class="column has-text-centered has-text-grey">
                <p>
                  Failed to retrieve tutorials submitted for review. Please try again later.
                  <span class="icon is-small">
                    <i class="far fa-frown"></i>
                  </span>
                </p>
              </div>
                  <div class="columns" each={ submittedTutorials }>
                    <div class="column">
                      <div class="card">
                        <header class="card-header">
                          <div class="level is-full-width">
                            <div class="level-left">
                              <div class="level-item">
                                <p class="card-header-title"><a href="{ ownerUrl }">{ owner }</a>:</p>
                              </div>
                              <div class="level-item">
                                <p>{ name }</p>
                              </div>
                              <div class="level-item">
                                <a href={ url } show={ state !== null } target="_blank"> 
                                  <span class="icon is-small"><i class="fas fa-external-link-alt"></i></span>
                                </a>
                              </div>
                            </div>
                            <div class="level-right">
                              <div class="level-item">
                                <span show={ state === 'open' } class="tag is-info">Submitted / Under Review</span>
                                <span show={ state === 'changesRequested' } class="tag is-warning" title="Please click on the external link icon for more context">Changes Requested</span>
                                <span show={ state === 'approved' } class="tag is-success">Approved / Awaiting Merge</span>
                              </div>
                              <div class="level-item">
                                <a href="{ previewUrl }" class="button is-info">View</a>
                              </div>
                            </div>
                          </div>
                        </header>
                      </div>
                    </div>
                  </div>
          </div>
        </div>
      </div>
    </section>
  <script>
    var self = this
    this.isLoading = true
    this.loadingText = 'fetching tutorials submitted for review...'
    this.submittedTutorials = []
    this.on('mount', function() {
      const url = '/v1/tutorials/submitted'
      $.get(url, function (result) {
        const submittedTutorials = result.data.submittedTutorials
        if (submittedTutorials.length === 0){
          self.noTutorialsFound = true
        }
        else{
          self.submittedTutorials = submittedTutorials
        }
        self.isLoading = false
        self.update()
      })
      .fail(function (error) {
        self.isLoading = false
        self.failedToGetTutorials = true
        self.update()
      })
    })
  
  </script>
</submitted-tutorials>