<builder>
  <style>
    .mathContent {
      font-family: 'consolas';
    }

    .moveHandle {
      cursor: move;
    }
  </style>
  <section class="section">
    <div class="tabs is-centered is-boxed">
      <ul>
        <li id="configTab">
          <a onclick={pickConfiguration}>
            <span>Configuration</span>
          </a>
        </li>
        <li id="contentTab">
          <a onclick={pickContent}>
            <span>Content</span>
          </a>
        </li>
        <li id="exercisesTab">
          <a onclick={pickExercises}>
            <span>Exercises</span>
          </a>
        </li>
      </ul>
    </div>
    <configuration id="config"></configuration>
    <content id="content"></content>
    <exercises id="exercises"></exercises>
    <div class="container">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <button class="button is-success { is-loading: isSavingTutorial }" onclick={saveState}>Save Current Tutorial State</div>
          <div class="level-item">
            <p show={ saveTutorialSuccess } class="help has-text-grey">
              <span class="icon is-small has-text-success">
                <i class="fa fa-check"></i>
              </span>
              Tutorial State Saved
            </p>
            <p show={ saveTutorialFailed } class="help has-text-grey">
              <span class="icon is-small has-text-danger">
                <i class="fa fa-times"></i>
              </span>
              Unfortunately, we failed to save the current tutorial state. Please try again.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
  <script>
    var that = this
    this.isSavingTutorial = false
    this.saveTutorialSuccess = false
    this.saveTutorialFailed = false
    this.on('mount', function () {
      this.pickConfiguration();
      //      console.log('configData', this.tags.configuration)
      //     console.log('contentData', this.tags.content)
      //    console.log('exerciseData', this.tags.exercises)
    })
    pickConfiguration() {
      $("#configTab").addClass("is-active")
      $("#contentTab").removeClass("is-active")
      $("#exercisesTab").removeClass("is-active")
      $("#content").hide();
      $("#exercises").hide();
      $("#config").show();
    }
    pickContent() {
      $("#configTab").removeClass("is-active")
      $("#contentTab").addClass("is-active")
      $("#exercisesTab").removeClass("is-active")
      $("#content").show();
      $("#exercises").hide();
      $("#config").hide();
    }
    pickExercises() {
      $("#configTab").removeClass("is-active")
      $("#contentTab").removeClass("is-active")
      $("#exercisesTab").addClass("is-active")
      $("#content").hide();
      $("#exercises").show();
      $("#config").hide();
    }

    saveState() {
      this.isSavingTutorial = true
      this.saveTutorialSuccess = false
      this.saveTutorialFailed = false
      const urlPaths = window.location.href.split('/')
      console.log('url paths', urlPaths)
      const tutorialName = urlPaths.pop()
      const data = {
        tutorialName: tutorialName,
        config: this.tags.configuration.get(),
        content: this.tags.content.get(),
        exercises: this.tags.exercises.get()
      }
      console.log(data)
      const url = '/v1/save/tutorial'
      $.ajax({
        url: url,
        type: 'PUT',
        data: { data: JSON.stringify(data) },
        success: function (result) {
          console.log('saved tutorial successfully')
          that.isSavingTutorial = false
          that.saveTutorialSuccess = true
          that.saveTutorialFailed = false
          that.update()
        },
        error: function (xhr, textStatus, errorThrown) {
          that.isSavingTutorial = false
          that.saveTutorialSuccess = false
          that.saveTutorialFailed = true
          that.update()
          console.log(errorThrown)
        }
      })
    }
  </script>
</builder>