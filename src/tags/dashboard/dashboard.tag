<dashboard>
  <style>
    .button-padding {
      padding-right: 12px;
    }
  </style>
  <section class="section">
    <div class="container">
      <a class="button is-success" onclick={ openTutorialModal }>Create Tutorial</a>
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
              </div>
              <div class="level-right">
                <div class="level-item">
                  <span class="tag is-primary">Status</span>
                </div>
                <div class="level-item">
                  <p class="content"><span class="icon is-small"><i class="fa fa-clock-o"></i></span> Last Edited Date</p>                  
                </div>
              </div>
            </div>
            </header>
            <footer class="card-footer">
              <a class="card-footer-item" onclick="{ parent.openSubmitTutorialModal }">
                <span class="icon is-small"><i class="fa fa-send"></i></span>
              </a>
              <a class="card-footer-item edit" onclick="{ parent.editTutorial }">
                <span class="icon is-small"><i class="fa fa-pencil"></i></span>
              </a>
              <a class="card-footer-item delete-button" onclick="{ parent.deleteTutorial }">
                <span class="icon is-small"><i class="fa fa-times"></i></span>
              </a>
            </footer>
          </div>

        </div>
      </div>
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
              <input ref="tutorialName" type="text" class="input" placeholder="e.g. ele-algebra-factoring"/>
          </div>
          <p show={ invalidTutorialName } class="help has-text-danger">
            The name you have chosen is invalid. Please refer to the criteria to see what constitutes a valid name.
          </p>
          <p class="help">
          <span class="has-text-grey">
            The tutorial name will be used to identify the tutorial for you and other contributors of Mathbook
            so make sure it's representative of the tutorial you are going to create. 
            </span>
            <br/>
            <br/>
            <strong>Criteria:</strong> between 10 to 30 characters restricted to Alphanumeric and dashes ( - ) only.
            <br/>
            <br/> 
            <strong>Note:</strong> Admins reserve the right to delete the tutorial if the name contains anything offensive or inappropriate.
          </p>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" onclick={ createTutorial }>Create</button>
          <button class="button" onclick={ closeTutorialModal }>Cancel</button>
        </footer>
      </div>
    </div>
          </div>
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
              <textarea ref="submitTutorialDescription" class="textarea" placeholder="feel free use Markdown"/>
          </div>
          <p class="help has-text-grey">
            Providing a description for the tutorial is optional, however it is usually good practice to include a description
            of what your tutorial contains so that the contributors that review your tutorial have an idea of what to expect.  
          </p>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button disabled={ submitTutorialSuccess } class="button is-success" onclick={ submitTutorial }>Submit</button>
          <button class="button" onclick={ closeSubmitTutorialModal }>Close</button>
          <p show={ submitTutorialSuccess } class="help">
            <span class="icon is-small has-text-success">
              <i class="fa fa-check"></i> 
            </span>
            Congratulations, your tutorial was successfully submitted.
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
    this.tutorials = []
    $(document).ready(() => {
      $.get('/v1/tutorials', function (result) {
        console.log('result from /v1/tutorials', result)
        that.tutorials = result.tutorials
        that.update()
      })
    })
    createTutorial() {
      const tutorialName = this.refs.tutorialName.value
      if (this.tutorialNameInvalid(tutorialName)) {
        console.log('tutorial Name invalid',tutorialName)
        this.invalidTutorialName = true
        return
      }
      this.invalidTutorialName = false
      const url = '/v1/fork'
      $.post(url, { 'branchName': tutorialName }, function (result) {
        console.log("result from post", result)
        window.location.href = '/editor/' + tutorialName
      })
    }

    tutorialNameInvalid(tutorialName){
      var namePattern = new RegExp(/^[a-zA-Z0-9-]{10,30}$/)
      return (!namePattern.test(tutorialName))
    }

    submitTutorial() {
      const tutorialName = this.submitTutorialName
      const submitDescription = this.refs.submitTutorialDescription.value || ''
      console.log('submitting tutorial with id', tutorialName)
      const url = '/v1/submit/tutorial'
      $.ajax({
        url: url, 
        type: 'PUT', 
        data: { tutorialName: tutorialName, submitDescription: submitDescription }, 
        success: function(result) {
        console.log('submitted the tutorial with id', tutorialName)
        that.submitTutorialSuccess = true
        that.update()
        }
      })
    }
    editTutorial(e) {
      console.log('editing tutorial with id', e.item)
      window.location.href = '/editor/' + e.item.name

    }
    deleteTutorial(e) {
      const confirmDelete = confirm('Would you like to delete the tutorial ? This action is final and cannot be undone.')
      if (confirmDelete){
          console.log('deleting tutorial with id', e.item)
          const url = '/v1/remove/tutorial'
          $.ajax({
            url: url, 
            type: 'DELETE', 
            data: { tutorialName: e.item.name }, 
            success: function(result) {
            console.log('deleted the tutorial with id', e.item.name)
            }
          })
      }
    }

    openSubmitTutorialModal(e){
      this.showSubmitTutorialModel = true
      this.submitTutorialSuccess = false
      this.submitTutorialName = e.item.name
      console.log('submitTutorialName', this.submitTutorialName)
    }
    closeSubmitTutorialModal(){
      this.showSubmitTutorialModel = false
      this.submitTutorialSuccess = false
      this.submitTutorialName = ''
    }

    openTutorialModal(){
       this.showCreateTutorialModel = true
    }
    closeTutorialModal(){
       this.showCreateTutorialModel = false
    }

    formatDate(timestamp) {
      return moment.unix(timestamp).format('MMMM DD, YYYY HH:mm:ss')
    }
  </script>
</dashboard>