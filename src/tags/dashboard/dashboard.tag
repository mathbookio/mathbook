<dashboard>
  <style>
    .button-padding {
      padding-right: 12px;
    }
  </style>
  <section class="section">
    <div class="container">
      <a class="button is-success" onclick={createTutorial}>Create Tutorial</a>
      <div class="columns">
        <div class="column">
          <div class="card">
            <header class="card-header">
            <div class="level is-full-width">
              <div class="level-left">
                <div class="level-item">
                  <p class="card-header-title">Tutorial Subject</p>
                </div>
                <div class="level-item">
                  <p>Tutorial Title</p>
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
              <a class="card-footer-item">
                <span class="icon is-small"><i class="fa fa-send"></i></span>
              </a>
              <a class="card-footer-item edit">
                <span class="icon is-small"><i class="fa fa-pencil"></i></span>
              </a>
              <a class="card-footer-item delete-button">
                <span class="icon is-small"><i class="fa fa-times"></i></span>
              </a>
            </footer>
          </div>

        </div>
      </div>
    </div>
  </section>
  <script>
    var that = this
    $(document).ready(() => {
      $.get('/v1/tutorials', function (result) {
        console.log('result from /v1/tutorials', result)
        that.tutorials = result
      })
    })
    createTutorial() {
      console.log('current url', window.location.search)
      const url = '/v1/fork' + window.location.search
      $.post(url, function (result) {
        console.log("result from post", result)
      })
    }
    submitTutorial(id) {
      console.log('submitting tutorial with id', id)
    }
    editTutorial(id) {
      console.log('editing tutorial with id', id)
    }
    deleteTutorial(id) {
      console.log('deleting tutorial with id', id)
    }

    formatDate(timestamp) {
      return moment.unix(timestamp).format('MMMM DD, YYYY HH:mm:ss')
    }
  </script>
</dashboard>