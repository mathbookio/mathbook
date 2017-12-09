riot.tag2(
  "create-tutorial",
  '<div class="modal {is-active: showCreateTutorialModal}"> <div class="modal-background"></div> <div class="modal-card"> <header class="modal-card-head"> <p class="modal-card-title">Create A Tutorial</p> <button class="delete" aria-label="close" onclick="{closeModal}"></button> </header> <section class="modal-card-body"> <div class="field"> <label>Tutorial Name</label> <div class="control"> <input ref="tutorialName" type="text" class="input" placeholder="e.g. ele-algebra-factoring"> </div> <p show="{invalidTutorialName}" class="help has-text-danger"> The name you have chosen is invalid. Please refer to the criteria to see what constitutes a valid name. </p> <p class="help"> <span class="has-text-grey"> The tutorial name will be used to identify the tutorial for you and other contributors of Mathbook so make sure it\'s representative of the tutorial you are going to create. </span> <br> <br> <strong>Criteria:</strong> between 10 to 30 characters restricted to Alphanumeric and dashes ( - ) only. <br> <br> <strong>Note:</strong> Admins reserve the right to delete the tutorial if the name contains anything offensive or inappropriate. </p> </div> </section> <footer class="modal-card-foot"> <button class="button is-success {is-loading: isCreating}" onclick="{createTutorial}">Create</button> <button class="button" onclick="{closeModal}">Cancel</button> <p show="{createSuccess}" class="help"> <span class="icon is-small has-text-success"> <i class="fa fa-check"></i> </span> Congratulations, your tutorial was successfully created. You will be redirected momentarily. </p> <p show="{createFailed}" class="help"> <span class="icon is-small has-text-danger"> <i class="fa fa-times"></i> </span> Unfortunately, we were unable to create the tutorial for the following reason, <strong>{createFailedMessage}</strong> </p> </footer> </div> </div> </div>',
  "",
  "",
  function(opts) {
    var that = this
    this.observable = this.opts.observable
    this.showCreateTutorialModal = false
    this.invalidTutorialName = false
    this.isCreating = false
    this.createSuccess = false
    this.createFailed = false
    this.createFailedMessage = ""

    this.on("mount", function() {
      this.observable.on("openCreateModal", function() {
        that.open()
        that.update()
      })
    })

    this.open = function() {
      this.showCreateTutorialModal = true
    }.bind(this)

    this.closeModal = function() {
      this.showCreateTutorialModal = false
      this.cleanup()
    }.bind(this)

    this.cleanup = function() {
      this.invalidTutorialName = false
      this.isCreating = false
      this.createFailed = false
      this.createFailedMessage = ""
      this.refs.tutorialName.value = ""
    }.bind(this)

    this.createTutorial = function() {
      const tutorialName = this.refs.tutorialName.value
      if (this.tutorialNameInvalid(tutorialName)) {
        console.log("tutorial Name invalid", tutorialName)
        this.invalidTutorialNameEntered()
        return
      }
      this.prepareToCreateTutorial()
      const url = "/v1/create"
      $.post(
        url,
        {
          branchName: tutorialName
        },
        function(result) {
          console.log("result from post", result)
          that.createTutorialSucceeded()
          that.update()
          setTimeout(function() {
            console.log("tutorial created successfully")
            window.location.href = "/editor/" + tutorialName
          }, 2500)
        }
      ).fail(function(error) {
        console.log(error)
        let message = ""
        if (error.status === 409) {
          console.log("the name of tutorial you entered is unavailable.")
          message = "The tutorial name is already in use. Please create a different name."
        } else {
          message = "Uh-oh something broke on the server side. Please try again."
        }
        that.createTutorialFailed(message)
        handleError(error)
        that.update()
      })
    }.bind(this)

    this.invalidTutorialNameEntered = function() {
      this.invalidTutorialName = true
      this.isCreating = false
      this.createSuccess = false
    }.bind(this)

    this.prepareToCreateTutorial = function() {
      this.invalidTutorialName = false
      this.createSuccess = false
      this.isCreating = true
      this.createFailed = false
      this.createFailedMessage = ""
    }.bind(this)

    this.createTutorialSucceeded = function() {
      this.isCreating = false
      this.createSuccess = true
      this.createFailed = false
      this.createFailedMessage = ""
    }.bind(this)

    this.createTutorialFailed = function(message) {
      this.isCreating = false
      this.createSuccess = false
      this.createFailed = true
      this.createFailedMessage = message
    }.bind(this)

    this.tutorialNameInvalid = function(tutorialName) {
      var namePattern = new RegExp(/^[a-zA-Z0-9-]{10,30}$/)
      return !namePattern.test(tutorialName)
    }.bind(this)
  }
)
riot.tag2(
  "dashboard",
  '<section class="section"> <div class="container"> <div class="content"> <a class="button is-success" onclick="{openCreateTutorialModal}">Create Tutorial</a> </div> <div show="{noTutorialsFound}" class="column has-text-centered has-text-grey"> <p> No Tutorials found! You should create one <span class="icon is-small"> <i class="fa fa-smile-o"></i> </span> </p> </div> <div show="{failedToGetTutorials}" class="column has-text-centered has-text-grey"> <p> Failed to retrieve tutorials for the following reason, {failedMessage} <span class="icon is-small"> <i class="fa fa-frown-o"></i> </span> </p> </div> <div show="{loadingTutorials}" class="column has-text-centered has-text-grey"> <p> Locating your Tutorials <span class="icon is-medium"> <i class="fa fa-cog fa-spin"></i> </span> </p> </div> <div class="columns" each="{tutorials}"> <div class="column"> <div class="card"> <header class="card-header"> <div class="level is-full-width"> <div class="level-left"> <div class="level-item"> <p class="card-header-title">Tutorial:</p> </div> <div class="level-item"> <p>{name}</p> </div> <div class="level-item"> <a href="{pullRequestUrl}" show="{state !== null}" target="_blank"> <span class="icon is-small"><i class="fa fa-external-link"></i></span> </a> </div> </div> <div class="level-right"> <div class="level-item"> <span show="{state === \'open\'}" class="tag is-info">Submitted / Under Review</span> <span show="{state === \'changesRequested\'}" class="tag is-warning" title="Please click on the external link icon for more context">Changes Requested</span> <span show="{state === \'approved\'}" class="tag is-success">Approved / Awaiting Merge</span> <span show="{state === \'merged\'}" class="tag is-success">Merged</span> <span show="{state === null}" class="tag">In Progress</span> <span show="{state === \'closed\'}" class="tag is-danger">Closed</span> </div> <div class="level-item"> <p class="content lastEdited" title="{formatDate(lastEdited)}"> <span class="icon is-small"> <i class="fa fa-clock-o"></i> </span> {formatDateFromNow(lastEdited)}</p> </div> </div> </div> </header> <footer class="card-footer"> <div show="{state === \'submitted\'}" class="card-footer-item has-text-grey"> <span class="icon is-small"> <i class="fa fa-send"></i> </span> </div> <a show="{state === null || state === \'closed\'}" class="card-footer-item" onclick="{parent.openSubmitTutorialModal}"> <span class="icon is-small"> <i class="fa fa-send"></i> </span> </a> <a class="card-footer-item edit" onclick="{parent.editTutorial}"> <span class="icon is-small"> <i class="fa fa-pencil"></i> </span> </a> <a class="card-footer-item edit" onclick="{parent.previewTutorial}"> <span class="icon is-small"> <i class="fa fa-file"></i> </span> <span> </span> <span class="icon is-small"> <i class="fa fa-search"></i> </span> </a> <a class="card-footer-item delete-button" onclick="{openDeleteTutorialModal}"> <span class="icon is-small"> <i class="fa fa-trash-o"></i> </span> </a> </footer> </div> </div> </div> <create-tutorial observable="{dashboardObservable}"></create-tutorial> <submit-tutorial observable="{dashboardObservable}"></submit-tutorial> <delete-tutorial observable="{dashboardObservable}"></delete-tutorial> </section>',
  'dashboard .button-padding,[data-is="dashboard"] .button-padding{ padding-right: 12px; } dashboard .lastEdited,[data-is="dashboard"] .lastEdited{ cursor: help; }',
  "",
  function(opts) {
    var that = this
    this.dashboardObservable = riot.observable()
    this.loadingTutorials = false
    this.noTutorialsFound = false
    this.tutorials = []
    this.failedToGetTutorials = false

    $(document).ready(function() {
      that.loadingTutorials = true
      that.update()
      $.get("/v1/tutorials", function(result) {
        console.log("result from /v1/tutorials", result)
        that.succeededRequest()
        if (Array.isArray(result.data.tutorials) && result.data.tutorials.length === 0) {
          that.noTutorialsFound = true
        } else {
          that.noTutorialsFound = false
        }
        that.tutorials = result.data.tutorials

        that.update()
      }).fail(function(res) {
        const error = res.responseJSON
        console.error("something broke while getting tutorials", error)
        that.failedRequest(error.message)
        handleError(error)
        that.update()
      })
    })

    this.succeededRequest = function() {
      this.loadingTutorials = false
      this.failedToGetTutorials = false
      this.failedMessage = ""
    }.bind(this)

    this.failedRequest = function(message) {
      this.loadingTutorials = false
      this.failedToGetTutorials = true
      this.failedMessage = message
    }.bind(this)

    this.editTutorial = function(e) {
      console.log("editing tutorial with id", e.item)
      window.location.href = "/editor/" + e.item.name
    }.bind(this)

    this.previewTutorial = function(e) {
      console.log("editing tutorial with id", e.item)
      window.location.href = "/preview/" + e.item.name
    }.bind(this)

    this.openSubmitTutorialModal = function(e) {
      console.log("submitTutorialName", this.submitTutorialName)
      const submitTutorialName = e.item.name
      this.dashboardObservable.trigger("openSubmitModal", submitTutorialName)
    }.bind(this)

    this.openDeleteTutorialModal = function(e) {
      const tutorialName = e.item.name
      console.log("deleteTutorialName", tutorialName)
      this.dashboardObservable.trigger("openDeleteModal", tutorialName)
    }.bind(this)

    this.openCreateTutorialModal = function() {
      this.dashboardObservable.trigger("openCreateModal")
    }.bind(this)

    this.formatDateFromNow = function(timestamp) {
      console.log("timestamp", timestamp)
      return moment(timestamp).fromNow()
    }.bind(this)
    this.formatDate = function(timestamp) {
      console.log("timestamp", timestamp)
      return moment(timestamp).format("MMMM DD, YYYY HH:mm:ss")
    }.bind(this)
  }
)
riot.tag2(
  "delete-tutorial",
  '<div class="modal {is-active: showDeleteTutorialModal}"> <div class="modal-background"></div> <div class="modal-card"> <header class="modal-card-head"> <p class="modal-card-title">Delete Tutorial</p> <button class="delete" aria-label="close" onclick="{closeModal}"></button> </header> <section class="modal-card-body"> <p> Are you sure you want to delete the tutorial <strong>{tutorialName}</strong> ? This action cannot be undone. If so, please enter the tutorial name to confirm the delete operation. </p> <br> <div class="field"> <label>Tutorial Name</label> <div class="control"> <input id="deleteTutorialName" ref="tutorialNameInput" type="text" class="input"> </div> </div> </section> <footer class="modal-card-foot"> <button disabled="{!safeToDelete}" class="button is-danger {is-loading: isDeleting}" onclick="{deleteTutorial}">Delete Tutorial</button> <button class="button" onclick="{closeModal}">Cancel</button> <p show="{deleteSuccess}" class="help"> <span class="icon is-small has-text-success"> <i class="fa fa-check"></i> </span> The tutorial was successfully deleted. The current page will refresh momentarily. </p> <p show="{deleteFailed}" class="help"> <span class="icon is-small has-text-danger"> <i class="fa fa-times"></i> </span> Unfortunately, we were unable to delete the tutorial at this time because of the following reason, <strong>{deleteFailedMessage}</strong> </p> </footer> </div> </div>',
  "",
  "",
  function(opts) {
    var that = this
    this.observable = this.opts.observable
    this.showDeleteTutorialModal = false
    this.safeToDelete = false
    this.isDeleting = false
    this.tutorialName = ""
    this.deleteSuccess = false
    this.deleteFailed = false
    this.deleteFailedMessage = ""

    this.on("mount", function() {
      this.observable.on("openDeleteModal", function(tutorialName) {
        that.open(tutorialName)
        that.update()
      })

      $("#deleteTutorialName").on("input", function(e) {
        var inputTutorialName = e.target.value

        if (inputTutorialName === that.tutorialName) {
          that.safeToDelete = true
          that.update()
          return
        }
        that.safeToDelete = false
        that.update()
      })
    })

    this.open = function(tutorialName) {
      this.tutorialName = tutorialName
      this.showDeleteTutorialModal = true
    }.bind(this)

    this.closeModal = function() {
      this.showDeleteTutorialModal = false
      this.cleanup()
    }.bind(this)

    this.cleanup = function() {
      this.safeToDelete = false
      this.tutorialName = ""
      this.isDeleting = false
      this.deleteSuccess = false
      this.deleteFailed = false
      this.deleteFailedMessage = ""
      this.refs.tutorialNameInput.value = ""
    }.bind(this)

    this.prepareToDelete = function() {
      this.isDeleting = true
      this.deleteSuccess = false
      this.deleteFailed = false
      this.deleteFailedMessage = ""
    }.bind(this)

    this.deleteTutorial = function() {
      this.prepareToDelete()
      const url = "/v1/remove/tutorial"
      $.ajax({
        url: url,
        type: "DELETE",
        data: {
          tutorialName: this.tutorialName
        },
        success: function(result) {
          that.deleteTutorialSucceeded()
          that.update()
          setTimeout(function() {
            window.location.reload()
          }, 2500)
        }
      }).fail(function(res) {
        console.log(res)
        const error = res.responseJSON
        console.error(error)
        that.deleteTutorialFailed(error.message)
        that.update()
      })
    }.bind(this)

    this.deleteTutorialSucceeded = function() {
      that.isDeleting = false
      that.deleteSuccess = true
      that.deleteFailed = false
      that.deleteFailedMessage = ""
    }.bind(this)

    this.deleteTutorialFailed = function(message) {
      that.isDeleting = false
      that.deleteSuccess = false
      that.deleteFailed = true
      that.deleteFailedMessage = message
    }.bind(this)
  }
)
riot.tag2(
  "submit-tutorial",
  '<div class="modal {is-active: showSubmitTutorialModel}"> <div class="modal-background"></div> <div class="modal-card"> <header class="modal-card-head"> <p class="modal-card-title">Submit Tutorial</p> <button class="delete" aria-label="close" onclick="{closeSubmitTutorialModal}"></button> </header> <section class="modal-card-body"> <div class="field"> <label>Tutorial Description (Optional)</label> <div class="control"> <textarea ref="submitTutorialDescription" class="textarea" placeholder="feel free use Markdown"></textarea> </div> <p class="help has-text-grey"> Providing a description for the tutorial is optional, however it is usually good practice to include a description of what your tutorial contains so that the contributors that review your tutorial have an idea of what to expect. </p> </div> </section> <footer class="modal-card-foot"> <button disabled="{submitSuccess}" class="button is-success {is-loading: isSubmitting}" onclick="{submitTutorial}">Submit</button> <button class="button" onclick="{closeSubmitTutorialModal}">Close</button> <p show="{submitSuccess}" class="help"> <span class="icon is-small has-text-success"> <i class="fa fa-check"></i> </span> Congratulations, your tutorial was successfully submitted. You can view the submission <a href="{pullRequestUrl}" target="_blank">here</a> This page will now refresh in a moment. </p> <p show="{submitFailed}" class="help"> <span class="icon is-small has-text-danger"> <i class="fa fa-times"></i> </span> Unfortunately, we were unable to submit your tutorial for the following reason, <strong>{failedMessage}</strong> </p> </footer> </div> </div>',
  "",
  "",
  function(opts) {
    var that = this
    this.tutorialName = ""
    this.observable = this.opts.observable
    this.showSubmitTutorialModel = false
    this.submitSuccess = false
    this.submitFailed = false
    this.isSubmitting = false
    this.submitComplete = false
    this.failedMessage = ""

    this.on("mount", function() {
      this.observable.on("openSubmitModal", function(tutorialName) {
        that.openSubmitModal(tutorialName)
        that.update()
      })
    })

    this.openSubmitModal = function(tutorialName) {
      this.tutorialName = tutorialName
      this.showSubmitTutorialModel = true
    }.bind(this)

    this.submitTutorial = function() {
      const tutorialName = this.tutorialName
      const submitDescription = this.refs.submitTutorialDescription.value || ""
      this.isSubmitting = true
      const url = "/v1/submit/tutorial"
      $.ajax({
        url: url,
        type: "PUT",
        data: {
          tutorialName: tutorialName,
          submitDescription: submitDescription
        },
        success: function(result) {
          const pullRequestUrl = result.pullRequestUrl
          that.submitTutorialSucceeded(pullRequestUrl)
          that.update()
          setTimeout(function() {
            window.location.reload()
          }, 4500)
        }
      }).fail(function(res) {
        const error = res.responseJSON
        console.log(error)
        that.submitTutorialFailed(error.message)
        that.update()
      })
    }.bind(this)

    this.submitTutorialSucceeded = function(pullRequestUrl) {
      this.submitSuccess = true
      this.submitFailed = false
      this.isSubmitting = false
      this.submitComplete = true
      this.pullRequestUrl = pullRequestUrl
      this.failedMessage = ""
    }.bind(this)

    this.submitTutorialFailed = function(message) {
      this.submitSuccess = false
      this.submitFailed = true
      this.isSubmitting = false
      this.submitComplete = false
      this.pullRequestUrl = ""
      this.failedMessage = message
    }.bind(this)

    this.closeSubmitTutorialModal = function() {
      this.showSubmitTutorialModel = false
      this.cleanup()
    }.bind(this)

    this.cleanup = function() {
      this.tutorialName = ""
      this.submitSuccess = false
      this.submitFailed = false
      this.isSubmitting = false
      this.submitComplete = false
    }.bind(this)
  }
)
riot.tag2(
  "tutorial",
  '<tr> <td>{opts.name}</td> <td>{opts.status}</td> <td> <a class="button is-primary" onclick="{editTutorial}">Edit</a> <a class="button is-danger" onclick="{deleteTutorial}">Delete</a> </td> <td>{opts.timestamp}</td> </tr>',
  "",
  "",
  function(opts) {
    this.editTutorial = function() {
      console.log("Editing Tutorial")
    }.bind(this)
    this.deleteTutorial = function() {
      console.log("Deleting Tutorial")
    }.bind(this)
  }
)
riot.tag2(
  "builder",
  '<loading-spinner loading-flag="{isLoading}" text="{loadingText}"></loading-spinner> <session-modal observable="{sessionObservable}"></session-modal> <section class="section" hide="{isLoading}"> <div class="tabs is-centered is-boxed"> <ul> <li id="configTab"> <a onclick="{pickConfiguration}"> <span>Configuration</span> </a> </li> <li id="contentTab"> <a onclick="{pickContent}"> <span>Content</span> </a> </li> <li id="exercisesTab"> <a onclick="{pickExercises}"> <span>Exercises</span> </a> </li> </ul> </div> <configuration id="config"></configuration> <content id="content"></content> <exercises id="exercises"></exercises> <div class="container"> <div class="level"> <div class="level-left"> <div class="level-item"> <button class="button is-success {is-loading: isSavingTutorial}" onclick="{saveTutorial}">Save Current Tutorial State</button> </div> <div class="level-item"> <p show="{saveTutorialSuccess}" class="help has-text-grey"> <span class="icon is-small has-text-success"> <i class="fa fa-check"></i> </span> Tutorial State Saved - {currentTime} </p> <p show="{saveTutorialFailed}" class="help has-text-grey"> <span class="icon is-small has-text-danger"> <i class="fa fa-times"></i> </span> Unfortunately, we failed to save the current tutorial state. Please try again. </p> </div> </div> <div class="level-right"> <div class="level-item"> <p> <a class="button is-info" onclick="{previewTutorial}">Save & Preview</a> </p> </div> </div> </div> </div> </section>',
  'builder .mathContent,[data-is="builder"] .mathContent{ font-family: \'consolas\'; } builder .moveHandle,[data-is="builder"] .moveHandle{ cursor: move; cursor: -webkit-grabbing; }',
  "",
  function(opts) {
    var that = this
    this.loadingText = "Retrieving last saved state. Hang on."
    this.isLoading = true
    this.sessionObservable = riot.observable()
    this.sessionExpiry = 0
    this.sessionExpiryTimer
    this.tutorialName = this.opts.tutorialName || ""
    this.currentTime = ""
    this.showedPreviewConfirmation = false
    this.isSavingTutorial = false
    this.saveTutorialSuccess = false
    this.saveTutorialFailed = false

    this.on("mount", function() {
      this.initLeavePrompt()
      this.pickConfiguration()
      const url = "/v1/tutorial/" + this.tutorialName
      $.get(url, function(result) {
        console.log("getTutorialData data", result)
        that.tags.configuration.set(result.data.config),
          that.tags.content.set(result.data.content),
          that.tags.exercises.set(result.data.exercises)
        that.isLoading = false
        that.sessionExpiry = result.metadata.expiresOn
        that.initSessionExpiryTimer()
        that.update()
      }).fail(function(res) {
        const error = res.responseJSON
        handleError(error)
      })

      this.sessionObservable.on("saveTutorial", function() {
        that.saveState(function(err, result) {
          if (err) {
            that.sessionObservable.trigger("saveFailed")
          } else {
            that.sessionObservable.trigger("saveSuccess")
          }
          that.update()
        })
      })
    })

    this.initLeavePrompt = function() {
      $(window).bind("beforeunload", function() {
        return "Please make sure you save your changes before navigating away from this page."
      })
    }.bind(this)

    this.initSessionExpiryTimer = function() {
      const triggerTime = 300
      var currentTime = moment.utc().unix()
      this.sessionExpiryTimer = setInterval(function() {
        const timeRemaining = that.sessionExpiry - currentTime
        console.log("timeRemaining", timeRemaining, "currentTime", currentTime, "sessionExpiry", that.sessionExpiry)
        if (timeRemaining <= triggerTime) {
          that.sessionObservable.trigger("sessionExpiringSoon", timeRemaining)
          that.killSessionExpiryTimer()
        }
        currentTime += 1
      }, 1000)
    }.bind(this)

    this.killSessionExpiryTimer = function() {
      clearInterval(this.sessionExpiryTimer)
    }.bind(this)

    this.pickConfiguration = function() {
      $("#configTab").addClass("is-active")
      $("#contentTab").removeClass("is-active")
      $("#exercisesTab").removeClass("is-active")
      $("#content").hide()
      $("#exercises").hide()
      $("#config").show()
    }.bind(this)
    this.pickContent = function() {
      $("#configTab").removeClass("is-active")
      $("#contentTab").addClass("is-active")
      $("#exercisesTab").removeClass("is-active")
      $("#content").show()
      $("#exercises").hide()
      $("#config").hide()
    }.bind(this)
    this.pickExercises = function() {
      $("#configTab").removeClass("is-active")
      $("#contentTab").removeClass("is-active")
      $("#exercisesTab").addClass("is-active")
      $("#content").hide()
      $("#exercises").show()
      $("#config").hide()
    }.bind(this)

    this.previewTutorial = function() {
      return this.saveState(function(err, result) {
        if (err) {
          const skipSaving = confirm(
            "Unfortunately, we were unable to save the current state of the tutorial. Would you like to preview your last saved state ? \n Note that your current changes will be lost."
          )
          if (skipSaving) {
            window.location.href = "/preview/" + that.tutorialName
          }
          return
        }
        window.location.href = "/preview/" + that.tutorialName
      })
    }.bind(this)

    this.saveTutorial = function() {
      this.saveState()
    }.bind(this)

    this.saveState = function(callback) {
      this.isSavingTutorial = true
      this.saveTutorialSuccess = false
      this.saveTutorialFailed = false
      const data = {
        tutorialName: this.tutorialName,
        config: this.tags.configuration.get(),
        content: this.tags.content.get(),
        exercises: this.tags.exercises.get()
      }
      console.log(data)
      const url = "/v1/save/tutorial"
      $.ajax({
        url: url,
        type: "PUT",
        data: { data: JSON.stringify(data) },
        success: function(result) {
          console.log("saved tutorial successfully")
          that.isSavingTutorial = false
          that.saveTutorialSuccess = true
          that.saveTutorialFailed = false
          that.currentTime = new Date().toLocaleTimeString()
          that.update()
          if (callback) {
            callback(null, { status: 200 })
          }
        }
      }).fail(function(res) {
        that.isSavingTutorial = false
        that.saveTutorialSuccess = false
        that.saveTutorialFailed = true
        that.update()
        const error = res.responseJSON
        console.log(error)
        if (callback) {
          callback(error, null)
        }
      })
    }.bind(this)
  }
)
riot.tag2(
  "configuration",
  '<section class="section"> <div class="container"> <h5 class="title">Configuration</h5> <subject></subject> <br> <config-title></config-title> <br> <opening-statement></opening-statement> <br> <pre-req></pre-req> <br> <exercise-statement></exercise-statement> <br> <resources></resources> <br> <keywords></keywords> </section>',
  "",
  "",
  function(opts) {
    this.get = function() {
      return {
        subject: this.tags["subject"].get(),
        title: this.tags["config-title"].get(),
        openingStatement: this.tags["opening-statement"].get(),
        preReqs: this.tags["pre-req"].get(),
        exerciseStatement: this.tags["exercise-statement"].get(),
        resources: this.tags["resources"].get(),
        keywords: this.tags["keywords"].get()
      }
    }.bind(this)
    this.set = function(data) {
      this.tags["subject"].set(data["subject"])
      this.tags["config-title"].set(data["title"])
      this.tags["opening-statement"].set(data["openingStatement"])
      this.tags["pre-req"].set(data["preReqs"])
      this.tags["exercise-statement"].set(data["exerciseStatement"])
      this.tags["resources"].set(data["resources"])
      this.tags["keywords"].set(data["keywords"])
    }.bind(this)
  }
)

riot.tag2(
  "content",
  '<section class="section"> <div id="contentContainer" class="container"> <h5 class="title">Content</h5> <h6 class="subtitle">The content explains the \'What\', \'Why\' and \'How\'</h6> <div class="field"> <div class="control"> <input type="text" id="contentTitle" class="input mathContent {is-danger: isTitleEmpty}" placeholder="Section Title ie) Understanding Factoring"> <p show="{isTitleEmpty}" class="help is-danger">Title can\'t be empty</p> </div> </div> <div class="field"> <div class="control"> <textarea id="contentSection" class="textarea mathContent {is-danger: isContentEmpty}" placeholder="section content..."></textarea> <p show="{isContentEmpty}" class="help is-danger">The content section can\'t be empty</p> </div> <br> <div class="control"> <label>Preview</label> <div class="box"> <p id="contentSectionText" class="previewText"></p> </div> </div> </div> <div class="control"> <a class="button is-info" onclick="{saveSection}">Add Section</a> </div> <br> <div id="sectionList"></div> </div> </section>',
  'content #contentSectionText,[data-is="content"] #contentSectionText{ white-space: pre-wrap; }',
  "",
  function(opts) {
    var that = this
    this.contentMap = {}
    this.isTitleEmpty = false
    this.isContentEmpty = false
    this.contentObservable = riot.observable()

    this.on("mount", function() {
      that.initSortable()

      this.contentObservable.on("createdContentSection", function(contentId, contentObj) {
        that.contentMap[contentId] = contentObj
      })

      this.contentObservable.on("deletedContentSection", function(contentId) {
        delete that.contentMap[contentId]
      })

      $("#contentSection").on("input", function(e) {
        var contentVal = $("#contentSection").val()
        $("#contentSectionText").html(contentVal)
        renderMathInElement(document.getElementById("contentSectionText"))
      })
    })

    this.initSortable = function() {
      var sectionList = document.getElementById("sectionList")
      Sortable.create(sectionList, {
        handle: ".moveHandle",
        onUpdate: function(e) {
          console.log("onUpdate triggered", e)
          console.log("old index", e.oldIndex)
          console.log("new index", e.newIndex)
          that.contentObservable.trigger("contentOrderUpdate", e.oldIndex, e.newIndex)
        }
      })
    }.bind(this)

    this.saveSection = function() {
      var sectionNumber = this.uniqueId()
      var sectionId = "sectionBox_" + sectionNumber

      var sectionTitle = $("#contentTitle").val()
      var sectionText = $("#contentSection").val()

      this.isTitleEmpty = this.isTextEmpty(sectionTitle)
      this.isContentEmpty = this.isTextEmpty(sectionText)
      if (this.isTitleEmpty || this.isContentEmpty) {
        return
      }
      this.generateSection(sectionId, sectionTitle, sectionText)
    }.bind(this)

    this.generateSection = function(sectionId, sectionTitle, sectionText) {
      const contentIndex = $("content-section").length
      console.log("contentIndex", contentIndex)
      $("#sectionList").append('<content-section ref="' + sectionId + '" id="' + sectionId + '"></content-section>')
      riot.mount("#" + sectionId, "content-section", {
        contentObservable: this.contentObservable,
        contentIndex: contentIndex,
        sectionTitle: sectionTitle,
        sectionText: sectionText
      })[0]
      this.cleanupFields()
      this.update()
    }.bind(this)

    this.cleanupFields = function() {
      $("#contentTitle").val("")
      $("#contentSection").val("")
      $("#contentSectionText").html("")
    }.bind(this)

    this.isTextEmpty = function(text) {
      return $.trim(text) === ""
    }.bind(this)

    this.uniqueId = function() {
      return Math.random()
        .toString(36)
        .substr(2, 10)
    }.bind(this)

    this.get = function() {
      const contentList = []
      for (var contentId in this.contentMap) {
        var content = this.contentMap[contentId].get()
        contentList[content.contentIndex] = content
      }
      return contentList
    }.bind(this)

    this.set = function(data) {
      console.log(data)
      if (Array.isArray(data)) {
        for (var i in data) {
          console.log("set::section", data[i])
          const sectionId = data[i].id
          const sectionTitle = data[i].title
          const sectionText = data[i].text
          this.generateSection(sectionId, sectionTitle, sectionText)
        }
      }
    }.bind(this)
  }
)
riot.tag2(
  "exercises",
  '<section class="section"> <div id="exerciseContainer" class="container"> <h5 class="title">Exercises</h5> <h6 class="subtitle">Create a minimum of 3 exercises that range in difficulty</h6> <div class="field"> <div class="control"> <input type="text" id="exerciseQuestion" class="input mathContent {is-danger: isQuestionInvalid}" placeholder="question"> <p show="{isQuestionInvalid}" class="help is-danger">Question can\'t be empty</p> </div> </div> <div class="field"> <div class="control"> <textarea id="exerciseAnswer" class="textarea mathContent {is-danger: isAnswerInvalid}" placeholder="the answer..."></textarea> <p show="{isAnswerInvalid}" class="help is-danger">Answer can\'t be empty</p> </div> <br> <div class="control"> <label>Question Preview</label> <div class="box"> <p id="exerciseQuestionText" class="previewText"></p> </div> </div> <div class="control"> <label>Answer Preview</label> <div class="box"> <p id="exerciseAnswerText" class="previewText"></p> </div> </div> </div> <div class="control"> <a class="button is-info" onclick="{saveSection}">Add Exercise</a> </div> <br> <div id="exerciseList"> </div> </div> </section>',
  'exercises #exerciseAnswerText,[data-is="exercises"] #exerciseAnswerText{ white-space: pre-wrap; }',
  "",
  function(opts) {
    var that = this
    this.exerciseMap = {}
    this.isQuestionInvalid = false
    this.isAnswerInvalid = false
    this.exerciseObservable = riot.observable()

    this.on("mount", function() {
      that.initSortable()

      this.exerciseObservable.on("createdExercise", function(exerciseId, exerciseObj) {
        that.exerciseMap[exerciseId] = exerciseObj
      })

      this.exerciseObservable.on("deletedExercise", function(exerciseId) {
        delete that.exerciseMap[exerciseId]
      })

      $("#exerciseQuestion").on("input", function(e) {
        var questionVal = $("#exerciseQuestion").val()
        $("#exerciseQuestionText").html(questionVal)
        renderMathInElement(document.getElementById("exerciseQuestionText"))
      })
      $("#exerciseAnswer").on("input", function(e) {
        var answerVal = $("#exerciseAnswer").val()
        $("#exerciseAnswerText").html(answerVal)
        renderMathInElement(document.getElementById("exerciseAnswerText"))
      })
    })

    this.initSortable = function() {
      var exerciseList = document.getElementById("exerciseList")
      Sortable.create(exerciseList, {
        handle: ".moveHandle",
        onUpdate: function(e) {
          console.log("onUpdate triggered", e)
          console.log("old index", e.oldIndex)
          console.log("new index", e.newIndex)
          that.exerciseObservable.trigger("exerciseOrderUpdate", e.oldIndex, e.newIndex)
        }
      })
    }.bind(this)

    this.saveSection = function() {
      var exerciseNumber = this.uniqueId()
      var exerciseId = "exerciseBox_" + exerciseNumber

      var question = $("#exerciseQuestion").val()
      var questionText = $("#exerciseQuestionText").html()

      var answer = $("#exerciseAnswer").val()
      var answerText = $("#exerciseAnswerText").html()

      this.isQuestionInvalid = this.isTextInvalid(questionText)
      this.isAnswerInvalid = this.isTextInvalid(answerText)
      if (this.isQuestionInvalid || this.isAnswerInvalid) {
        return
      }
      this.generateExercise(exerciseId, question, questionText, answer, answerText)
      this.cleanupFields()
    }.bind(this)

    this.generateExercise = function(exerciseId, question, questionText, answer, answerText) {
      const exerciseIndex = $("exercise-section").length
      console.log("exerciseIndex", exerciseIndex)
      $("#exerciseList").append('<exercise-section id="' + exerciseId + '"></exercise-section>')
      riot.mount("#" + exerciseId, {
        exerciseObservable: this.exerciseObservable,
        exerciseIndex: exerciseIndex,
        question: question,
        answer: answer
      })
    }.bind(this)

    this.isTextInvalid = function(text) {
      return $.trim(text) === ""
    }.bind(this)

    this.cleanupFields = function() {
      $("#exerciseQuestion").val("")
      $("#exerciseQuestionText").html("")
      $("#exerciseAnswer").val("")
      $("#exerciseAnswerText").html("")
    }.bind(this)

    this.uniqueId = function() {
      return Math.random()
        .toString(36)
        .substr(2, 10)
    }.bind(this)

    this.get = function() {
      const exerciseList = []
      console.log("exerciseMap", this.exerciseMap)
      for (var exerciseId in this.exerciseMap) {
        var exercise = this.exerciseMap[exerciseId].get()
        exerciseList[exercise.exerciseIndex] = exercise
      }
      return exerciseList
    }.bind(this)

    this.set = function(data) {
      console.log(data)
      if (Array.isArray) {
        for (var i in data) {
          console.log("set::exercise", data[i])
          const exerciseId = data[i].id
          const question = data[i].question
          const questionText = data[i].questionText
          const answer = data[i].answer
          const answerText = data[i].answerText
          this.generateExercise(exerciseId, question, questionText, answer, answerText)
        }
      }
    }.bind(this)
  }
)
riot.tag2(
  "homepage",
  '<section class="hero is-info is-medium"> <div class="hero-body"> <div class="container"> <h1 class="title">Welcome to Mathbook</h1> <h2 class="subtitle">An online repository of peer-reviewed tutorials on topics covering most subjects in mathematics</h2> </div> </div> </section> <section class="section my-section-margin"> <div class="container"> <h3 class="title is-3">Browse Subjects</h3> <h5 class="subtitle is-5">Each subject contains tutorials covering certain topics created by the contributors of Mathbook.</h5> </div> </section> <section class="section my-section-margin"> <div class="container"> <div id="mathSubjects" class="tile is-ancestor is-vertical"> <div class="title is-parent" each="{subjects}"> <a href="{⁗/subject/⁗ + id}" class="tile is-child box notification {color}"> <h3 class="title">{title}</h3> <div class="content is-medium"> <p>{blurb}</p> </div> <span class="content is-medium my-subject-example">{example}</span> </a> </div> </div> </div> </section> <section class="hero is-info"> <div class="hero-body"> <div class="container has-text-centered"> <h4 class="title is-4">Math is a tool we use to help us measure the world around us.</h4> <h6 class="subtitle is-5">For this reason alone, the benefits of learning math are worthwhile.</h6> </div> </div> </section>',
  "",
  "",
  function(opts) {
    const that = this
    console.log("options", this.opts)
    this.subjects = this.opts.subjects
    this.on("mount", function() {
      renderMath("mathSubjects")
    })
  }
)
riot.tag2(
  "loading-spinner",
  '<div show="{opts.loadingFlag}" class="column has-text-centered has-text-grey"> <p> {opts.text} <span class="icon is-medium"> <i class="fa fa-cog fa-spin"></i> </span> </p> </div>',
  "",
  "",
  function(opts) {
    var that = this
    console.log(this.opts)
  }
)
riot.tag2(
  "preview-tutorial",
  '<loading-spinner loading-flag="{isLoading}" text="{loadingText}"></loading-spinner> <div hide="{isLoading}"> <topic-title></topic-title> <intro></intro> <pre-reqs></pre-reqs> <table-contents></table-contents> <tutorial-sections></tutorial-sections> <tutorial-exercises></tutorial-exercises> <resource-list></resource-list> <meta-keywords></meta-keywords> </div>',
  "",
  "",
  function(opts) {
    var that = this
    this.loadingText = "Preparing Tutorial..."
    this.isLoading = true

    this.tutorialName = ""
    this.config = {}
    this.sections = []
    this.exercises = []
    this.on("mount", function() {
      const urlPaths = window.location.href.split("/")
      console.log("url paths", urlPaths)
      this.tutorialName = urlPaths.pop()
      const url = "/v1/tutorial/" + this.tutorialName
      $.get(url, function(result) {
        console.log("getTutorialData result", result)
        const data = result.data
        data.config["table-contents"] = []
        for (var section of data.content) {
          const sectionTitle = section["title"]
          const fragment = "#" + that.toSnakeCase(sectionTitle)
          data.config["table-contents"].push({ title: sectionTitle, fragment: fragment })
        }
        data.config["table-contents"].push({
          title: "Exercises",
          fragment: "#exercises"
        })
        data.config["table-contents"].push({
          title: "Resources",
          fragment: "#resources"
        })
        that.formatConfig(data.config),
          that.formatContent(data.content),
          that.formatExercises(data.exercises, data.config.exerciseStatement)
        that.update()
        renderMathInElement(document.body)
        that.isLoading = false
        that.update()
      }).fail(function(error) {
        handleError(error)
      })
    })

    this.formatConfig = function(config) {
      config["breadCrumbs"] = [
        {
          title: "Home",
          url: "/"
        },
        {
          title: config.subject,
          url: "/subject/" + this.toSnakeCase(config.subject)
        }
      ]

      this.tags["topic-title"].set(config)
      this.tags["intro"].set(config)
      this.tags["pre-reqs"].set(config)
      this.tags["table-contents"].set(config)
      this.tags["resource-list"].set(config)
      this.tags["meta-keywords"].set(config)
    }.bind(this)

    this.formatContent = function(sections) {
      for (var section of sections) {
        section["fragment"] = that.toSnakeCase(section.title)
      }
      this.tags["tutorial-sections"].set(sections)
    }.bind(this)

    this.formatExercises = function(exercises, exerciseStatement) {
      for (var exercise of exercises) {
        exercise["showAnswer"] = false
      }
      this.tags["tutorial-exercises"].set({ exercises: exercises, exerciseStatement: exerciseStatement })
    }.bind(this)

    this.toSnakeCase = function(text) {
      const txt = text || ""
      return txt.replace(/\s+/g, "-").toLowerCase()
    }.bind(this)
  }
)
riot.tag2(
  "review-tutorial",
  '<section class="section"> <div class="container"> <div class="content"> <div class="title is-5">You are now reviewing the tutorial: {tutorialName}</div> </div> </div> </section> <topic-title></topic-title> <intro></intro> <pre-reqs></pre-reqs> <table-contents></table-contents> <tutorial-sections></tutorial-sections> <tutorial-exercises></tutorial-exercises> <resource-list></resource-list> <meta-keywords></meta-keywords>',
  "",
  "",
  function(opts) {
    var that = this
    this.tutorialName = ""
    this.config = {}
    this.error = {}
    this.isError = false
    this.sections = []
    this.exercises = []
    this.comments = []
    this.on("mount", function() {
      const urlPaths = window.location.href.split("/")
      console.log("url paths", urlPaths)
      this.tutorialName = urlPaths.pop()
      this.userName = urlPaths.pop()
      const url = "/v1/tutorial/" + this.userName + "/" + this.tutorialName
      $.get(url, function(result) {
        this.isError = false
        console.log("getTutorialData result", result)
        result.config["table-contents"] = []
        for (var section of result.content) {
          const sectionTitle = section["title"]
          const fragment = "#" + that.toSnakeCase(sectionTitle)
          result.config["table-contents"].push({ title: sectionTitle, fragment: fragment })
        }
        result.config["table-contents"].push({
          title: "Exercises",
          fragment: "#exercises"
        })
        result.config["table-contents"].push({
          title: "Resources",
          fragment: "#resources"
        })
        that.formatConfig(result.config),
          that.formatContent(result.content),
          that.formatExercises(result.exercises, result.config.exerciseStatement)
        that.update()
        renderMathInElement(document.body)
      }).fail(function(error) {
        console.log(error)
        if (error.status === 404) {
          window.location.href = "/404"
          return
        }
      })
    })

    this.formatConfig = function(config) {
      config["breadCrumbs"] = [
        {
          title: "Home",
          url: "/"
        },
        {
          title: config.subject,
          url: "/subject/" + this.toSnakeCase(config.subject)
        }
      ]

      this.tags["topic-title"].set(config)
      this.tags["intro"].set(config)
      this.tags["pre-reqs"].set(config)
      this.tags["table-contents"].set(config)
      this.tags["resource-list"].set(config)
      this.tags["meta-keywords"].set(config)
    }.bind(this)

    this.formatContent = function(sections) {
      for (var section of sections) {
        section["fragment"] = that.toSnakeCase(section.title)
      }
      this.tags["tutorial-sections"].set(sections)
    }.bind(this)

    this.formatExercises = function(exercises, exerciseStatement) {
      for (var exercise of exercises) {
        exercise["showAnswer"] = false
      }
      this.tags["tutorial-exercises"].set({ exercises: exercises, exerciseStatement: exerciseStatement })
    }.bind(this)

    this.toSnakeCase = function(text) {
      const txt = text || ""
      return txt.replace(/\s+/g, "-").toLowerCase()
    }.bind(this)
  }
)
riot.tag2(
  "session-modal",
  '<div class="modal {is-active: showSessionModal}"> <div class="modal-background"></div> <div class="modal-card"> <header class="modal-card-head"> <p class="modal-card-title">Heads Up</p> </header> <section class="modal-card-body"> <div class="content"> <p hide="{sessionExpired}"> Hey there, <br> Your session will expire in <strong>{timeRemaining}</strong>. Currently, all sessions expire after 24 hours. Please save your changes and log back in to continue working on your tutorial. </p> <p show="{sessionExpired}"> Your Session has now expired. You are no longer able to save your changes. <span class="icon"><i class="fa fa-frown-o"></i></span> <br> <a href="/login">Click here to visit the Login page.</a> </p> <p show="{savingComplete}"> <span class="icon has-text-success"><i class="fa fa-check"></i></span> Successfully Saved Tutorial State. You will be redirected to the Login page momentarily. </p> <p show="{savingFailed}"> <span class="icon has-text-danger"><i class="fa fa-times"></i></span> Failed to Save Tutorial State. You will be redirected to the Login page momentarily. </p> </div> </section> <footer class="modal-card-foot"> <button disabled="{sessionExpired}" class="button is-info {is-loading: isSaving}" onclick="{save}">Save and Go to Login Page</button> <button disabled="{sessionExpired}" class="button is-white" onclick="{close}">Got it</button> </footer> </div> </div> </div>',
  "",
  "",
  function(opts) {
    var that = this
    this.observable = this.opts.observable
    this.showCreateTutorialModal = false
    this.isSaving = false
    this.savingComplete = false
    this.savingFailed = false
    this.countdown
    this.sessionExpired = false

    this.on("mount", function() {
      this.observable.one("sessionExpiringSoon", function(expireTime) {
        that.open(expireTime)
        that.update()
      })

      this.observable.on("saveSuccess", function() {
        that.isSaving = false
        that.savingComplete = true
        that.savingFailed = false
        that.update()
        setTimeout(function() {
          that.killCountdown()
          that.update()
          that.login()
        }, 3500)
      })

      this.observable.on("saveFailed", function() {
        that.isSaving = false
        that.savingComplete = false
        that.savingFailed = true
        that.update()
        setTimeout(function() {
          that.killCountdown()
          that.update()
          that.login()
        }, 3500)
      })
    })

    this.open = function(expireTime) {
      $(window).unbind("beforeunload")
      this.timeRemaining = this.formatExpireTime(expireTime)
      this.initCountdown(expireTime)
      this.showSessionModal = true
    }.bind(this)

    this.close = function() {
      $(window).bind("beforeunload", function() {
        return "Please make sure you save your changes before navigating away from this page."
      })
      this.showSessionModal = false
      this.killCountdown()
    }.bind(this)

    this.save = function() {
      this.observable.trigger("saveTutorial")
      this.isSaving = true
    }.bind(this)

    this.initCountdown = function(startTime) {
      var expireTime = startTime
      this.countdown = setInterval(function() {
        that.timeRemaining = that.formatExpireTime(expireTime)
        if (expireTime <= 0) {
          that.sessionExpired = true
          that.killCountdown()
          that.update()
          return
        }
        expireTime -= 1
        that.update()
      }, 1000)
    }.bind(this)

    this.killCountdown = function() {
      clearInterval(this.countdown)
    }.bind(this)

    this.formatExpireTime = function(expireTime) {
      if (expireTime <= 0) {
        return 0
      }
      let time = ""
      const minutes = moment.duration(expireTime, "seconds").minutes()
      const seconds = moment.duration(expireTime, "seconds").seconds()
      if (minutes > 0) {
        time += minutes + " minute(s) and "
      }
      if (seconds >= 0) {
        time += seconds + " seconds"
      }
      return time
    }.bind(this)

    this.login = function() {
      window.location.href = "/login"
    }.bind(this)
  }
)
riot.tag2(
  "subject-catalog",
  '<section class="section my-section-margin"> <div class="container"> <div class="heading"> <h1 class="title">{subjectData.title}</h1> </div> <h5 class="title is-5">{subjectData.blurb}</h5> </div> </section> <section class="section my-section-margin"> <div class="container"> <h3 class="title is-3">Please a select a topic from below</h3> </div> </section> <section class="section my-section-margin"> <div class="container"> <div show="{topics.length === 0}" class=" has-text-centered has-text-grey"> <p>Hey, we couldn\'t find any tutorials for this subject at the moment. Sorry. <br> If you want, you can build a tutorial and have it shown here for others to learn from and share! <span class="icon is-small"> <i class="fa fa-smile-o"></i> </span> </br> <a href="/contribute">Learn about becoming a contributor of Mathbook.</a> </p> </div> <div show="{topics.length > 0}" class="tile is-ancestor"> <div class="tile is-parent is-vertical"> <div each="{topics}"> <topic-box color="{color}" link="{link}" statement="{statement}" title="{title}" subject="{subject}"></topic-box> <br> </div> </div> </div> </div> </section>',
  "",
  "",
  function(opts) {
    var that = this
    console.log("subject catalog options", this.opts)
    this.subject = this.opts.subject || ""
    this.subjectData = {}
    this.topics = []
    this.on("mount", function() {
      const url = "/v1/subject/" + this.subject
      $.get(url, function(result) {
        console.log("got a result from url", url)
        console.log(result)
        that.topics = result.topics
        that.subjectData = result.subjectData
        that.update()
      }).fail(function(error) {
        console.log("failed to get anything from url", url)
        console.log(error)
        handleError(error)
      })
    })
  }
)
riot.tag2(
  "topic-box",
  "<a class=\"tile is-child box my-topic-box {'my-topic-' + opts.color + '-border'}\" href=\"{'/tutorial/' + opts.subject + '/' + opts.link}\"> <h3 class=\"title is-3\">{opts.title}</h3> <div class=\"content .is-medium\"> <p>{opts.statement}</p> </div> </a>",
  "",
  "",
  function(opts) {
    var that = this
  }
)
riot.tag2(
  "tutorial-exercises",
  '<section class="section my-section-margin"> <div class="container is-fluid"> <div id="exercises" class="title is-4">Exercises</div> <div class="content serif"> <p>{exerciseStatement}</p> <div class="content is-exercise" each="{exercises}"> <p id="{⁗q_⁗+exerciseIndex}" class="preWrap"> <span class="serif">{exerciseIndex + 1})</span> \\(\\quad\\) {question} \\(\\quad\\) </p> <button class="button is-white" onclick="{showExerciseAnswer}">Show Answer</button> <div class="columns"> <div class="column is-one-third"> </div> <div class="column is-one-third"> <p show="{showAnswer}" id="{⁗a_⁗+exerciseIndex}" class="preWrap">{answer}</p> </div> <div class="column is-one-third"> </div> </div> </div> </div> </div> </section>',
  'tutorial-exercises .preWrap,[data-is="tutorial-exercises"] .preWrap{ white-space: pre-wrap; }',
  "",
  function(opts) {
    var that = this
    this.exerciseStatement = this.opts.exerciseStatment || ""
    this.exercises = this.opts.exercises || []

    this.showExerciseAnswer = function(e) {
      const answerId = "#a_" + e.item.exerciseIndex
      $(answerId).toggle()
    }.bind(this)

    this.set = function(data) {
      this.exerciseStatement = data["exerciseStatement"]
      this.exercises = data["exercises"]
      for (var exe of this.exercises) {
        const index = exe.exerciseIndex
        const questionId = "#q_" + index
        const answerId = "#a_" + index
        try {
          renderMathInElement(document.getElementById(questionId))
          renderMathInElement(document.getElementById(answerId))
          $(answerId).toggle()
        } catch (err) {}
      }
    }.bind(this)
  }
)
riot.tag2(
  "intro",
  '<section class="section my-section-margin"> <div class="container is-fluid"> <div class="title is-4">Introduction</div> <div class="content serif"> <p itemprop="description">{openingStatement}</p> </div> </div> </section>',
  "",
  "",
  function(opts) {
    var that = this
    this.openingStatement = this.opts.openingStatement || ""

    this.set = function(data) {
      this.openingStatement = data["openingStatement"]
    }.bind(this)
  }
)
riot.tag2("meta-keywords", '<meta itemprop="keywords" content="{keywords}">', "", "", function(opts) {
  var that = this
  this.keywords = ""

  this.set = function(data) {
    this.keywords = (data["keywords"] || []).join(",")
  }.bind(this)
})
riot.tag2(
  "pre-reqs",
  '<section class="section my-section-margin"> <div class="container is-fluid"> <div class="title is-4">Prerequisites</div> <div class="content serif"> <p> The list of concepts that are required knowledge for this topic. It is important that you understand these concepts before diving in. </p> <ul> <li class="sans" each="{preReqs}"> <a itemprop="relatedLink" href="{url}" target="_blank"> {title} </a> </li> </ul> </div> </div> </section>',
  "",
  "",
  function(opts) {
    var that = this
    this.preReqs = this.opts.preReqs || []

    this.set = function(data) {
      this.preReqs = data["preReqs"]
    }.bind(this)
  }
)
riot.tag2(
  "resource-list",
  '<section class="section my-section-margin"> <div class="container is-fluid"> <div class="title is-4">Resources</div> <div class="content serif"> <ul> <li class="sans" each="{resourceList}"> <a href="{url}" target="_blank">{title}</a> </li> </ul> </div> </div> </section>',
  "",
  "",
  function(opts) {
    var that = this
    this.resourceList = this.opts.resourceList || []
    this.set = function(data) {
      this.resourceList = data["resources"]
    }.bind(this)
  }
)
riot.tag2(
  "table-contents",
  '<section class="section my-section-margin"> <div class="container is-fluid"> <div class="title is-4">Contents</div> <div class="content"> <ol class="sans"> <li each="{contentsList}"> <a href="{fragment}">{title}</a> </li> </ol> </div> </div> </section>',
  "",
  "",
  function(opts) {
    var that = this
    this.contentsList = this.opts.contentsList || []
    this.set = function(data) {
      this.contentsList = data["table-contents"]
    }.bind(this)
  }
)
riot.tag2(
  "topic-title",
  '<section class="section my-section-margin"> <div class="container is-fluid"> <div class="title" itemprop="name">{topicTitle}</div> <div class="level"> <div class="level-left"> <div class="column" itemprop="breadcrumb" itemtype="http://schema.org/BreadcrumbList" itemscope=""> <span each="{breadcrumbs}" itemprop="itemListElement"> <a href="{url}"> {title}</a> / </span> <span itemprop="itemListElement"> {topicTitle} </span> </div> </div> </div> </div> </section>',
  "",
  "",
  function(opts) {
    var that = this
    this.breadcrumbs = this.opts.breadcrumbs || []
    this.topicTitle = this.opts.title || ""

    this.set = function(data) {
      this.breadcrumbs = data["breadCrumbs"]
      this.topicTitle = data["title"]
    }.bind(this)
  }
)
riot.tag2(
  "tutorial-sections",
  '<section class="section my-section-margin" each="{sections}"> <div class="container is-fluid"> <div id="{fragment}" class="title is-4">{title}</div> <div id="{\'content_\'+contentIndex}" class="content preWrap serif"></div> </div> </section>',
  "",
  "",
  function(opts) {
    var that = this
    this.sections = this.opts.sections || []

    this.on("mount", function() {
      that.renderContent()
      that.update()
    })

    this.renderContent = function() {
      for (var section of this.sections) {
        const sectionId = "content_" + section.contentIndex
        console.log("section", section)
        $("#" + sectionId).html(section.text)
        const sectionContentElement = document.getElementById(sectionId)
        try {
          renderMathInElement(sectionContentElement)
        } catch (err) {
          console.log(err)
        }
      }
    }.bind(this)

    this.set = function(data) {
      console.log("tutorial-section", data)
      this.sections = data || []
      $(document).ready(function() {
        that.renderContent()
        that.update()
      })
    }.bind(this)
  }
)
riot.tag2(
  "view-tutorial",
  '<loading-spinner loading-flag="{isLoading}" text="{loadingText}"></loading-spinner> <div hide="{isLoading}"> <topic-title></topic-title> <intro></intro> <pre-reqs></pre-reqs> <table-contents></table-contents> <tutorial-sections></tutorial-sections> <tutorial-exercises></tutorial-exercises> <resource-list></resource-list> <meta-keywords></meta-keywords> </div>',
  "",
  "",
  function(opts) {
    var that = this
    this.loadingText = "Loading Tutorial...just a sec."
    this.isLoading = true

    console.log("this.opts", this.opts)
    this.tutorialName = this.opts.tutorialName || ""
    this.tutorialSubject = this.opts.subject || ""
    this.config = {}
    this.sections = []
    this.exercises = []
    this.on("mount", function() {
      console.log("tutorial subject", this.tutorialSubject, "tutorialName", this.tutorialName)
      const url = "/v1/tutorial/local/" + this.tutorialSubject + "/" + this.tutorialName
      $.get(url, function(result) {
        console.log("getTutorialData result", result)
        result.config["table-contents"] = []
        for (var section of result.content) {
          const sectionTitle = section["title"]
          const fragment = "#" + that.toSnakeCase(sectionTitle)
          result.config["table-contents"].push({ title: sectionTitle, fragment: fragment })
        }
        result.config["table-contents"].push({
          title: "Exercises",
          fragment: "#exercises"
        })
        result.config["table-contents"].push({
          title: "Resources",
          fragment: "#resources"
        })
        that.formatConfig(result.config),
          that.formatContent(result.content),
          that.formatExercises(result.exercises, result.config.exerciseStatement)
        that.update()
        renderMathInElement(document.body)
      })
        .fail(function(res) {
          console.log("there was an error fetching the tutorial", res)
          handleError(res)
        })
        .always(function() {
          that.isLoading = false
          that.update()
        })
    })

    this.formatConfig = function(config) {
      config["breadCrumbs"] = [
        {
          title: "Home",
          url: "/"
        },
        {
          title: config.subject,
          url: "/subject/" + this.toSnakeCase(config.subject)
        }
      ]

      this.tags["topic-title"].set(config)
      this.tags["intro"].set(config)
      this.tags["pre-reqs"].set(config)
      this.tags["table-contents"].set(config)
      this.tags["resource-list"].set(config)
      this.tags["meta-keywords"].set(config)
    }.bind(this)

    this.formatContent = function(sections) {
      for (var section of sections) {
        section["fragment"] = that.toSnakeCase(section.title)
      }
      this.tags["tutorial-sections"].set(sections)
    }.bind(this)

    this.formatExercises = function(exercises, exerciseStatement) {
      for (var exercise of exercises) {
        exercise["showAnswer"] = false
      }
      this.tags["tutorial-exercises"].set({ exercises: exercises, exerciseStatement: exerciseStatement })
    }.bind(this)

    this.toSnakeCase = function(text) {
      const txt = text || ""
      return txt.replace(/\s+/g, "-").toLowerCase()
    }.bind(this)
  }
)
riot.tag2(
  "config-title",
  '<div class="field"> <label class="label">Title</label> <div class="control"> <input ref="tutorialTitle" class="input" type="text" placeholder="Tutorial Title"> </div> </div>',
  "",
  "",
  function(opts) {
    var that = this
    this.get = function() {
      return this.refs.tutorialTitle.value
    }.bind(this)
    this.set = function(title) {
      console.log("configTitle::set", title)
      this.refs.tutorialTitle.value = title
    }.bind(this)
  }
)
riot.tag2(
  "exercise-statement",
  '<div class="field"> <label class="label">Exercises\' Statement</label> <div class="control"> <input id="exerciseStatement" class="input mathContent" type="text" placeholder="e.g. Solve for \\\\(y\\\\) for the following exercises"> </div> <br> <div class="control"> <label>Preview</label> <div class="box"> <p id="exerciseStatementText" class="previewText"></p> </div> </div> </div>',
  "",
  "",
  function(opts) {
    var that = this

    this.on("mount", function() {
      $("#exerciseStatement").on("input", function(e) {
        var osText = $("#exerciseStatement").val()
        console.log("osText", osText)
        $("#exerciseStatementText").html(osText)
        renderMathInElement(document.getElementById("exerciseStatementText"))
      })
    })

    this.get = function() {
      return $("#exerciseStatement").val()
    }.bind(this)
    this.set = function(statement) {
      $("#exerciseStatement").val(statement)
      $("#exerciseStatement").trigger("input")
    }.bind(this)
  }
)
riot.tag2(
  "keywords",
  '<div class="field"> <label class="label">Keywords <span class="normal">(max. 5)</span></label> </div> <div class="field is-grouped" id="preReq"> <div class="control is-expanded"> <input class="input {is-danger: invalidKeyword}" id="keyword" type="text" placeholder="Section Name" ref="keyword"> <p show="{invalidKeyword}" class="help is-danger">Keyword can\'t be empty</p> <p show="{tooManyKeywords}" class="help is-danger">max. number of keywords reached (5).</p> </div> <div class="control"> <a class="button is-success" onclick="{addKeyword}">Add</a> </div> </div> <div each="{keyword in keywords}" class="field"> <div class="control"> <span> {keyword}</span> <a class="tag is-danger" onclick="{removeKeyword}"> REMOVE </a> </div> </div>',
  "",
  "",
  function(opts) {
    this.keywords = []
    this.invalidKeyword = false
    this.tooManyKeywords = false
    this.addKeyword = function() {
      var keyword = this.refs.keyword.value
      console.log(keyword)
      this.invalidKeyword = isKeywordInvalid(keyword)
      if (!this.invalidKeyword) {
        if (this.keywords.length >= 5) {
          this.tooManyKeywords = true
          return
        }
        this.tooManyKeywords = false
        var insertIndex = this.keywords.length - 2
        this.keywords.splice(insertIndex, 0, keyword)
        console.log("Keyword IS VALID")
        this.refs.keyword.value = ""
        return
      }
      console.log("Keyword IS INVALID")
    }.bind(this)

    this.removeKeyword = function(event) {
      var item = event.item

      var index = this.keywords.indexOf(item)

      this.keywords.splice(index, 1)
    }.bind(this)

    function isKeywordInvalid(keyword) {
      return $.trim(keyword) === ""
    }

    this.get = function() {
      return this.keywords
    }.bind(this)
    this.set = function(keywords) {
      this.keywords = keywords || []
    }.bind(this)
  }
)
riot.tag2(
  "opening-statement",
  '<div class="field"> <label class="label">Opening Statement</label> <div class="control"> <textarea id="openingStatement" class="textarea mathContent" placeholder="a small and brief discussion of the topic being discussed"></textarea> </div> <br> <div class="control"> <label>Preview</label> <div class="box"> <p id="openingStatementText" class="previewText"></p> </div> </div> </div>',
  'opening-statement #openingStatementText,[data-is="opening-statement"] #openingStatementText{ white-space: pre-wrap; }',
  "",
  function(opts) {
    var that = this

    this.on("mount", function() {
      $("#openingStatement").on("input", function(e) {
        var osText = $("#openingStatement").val()
        console.log("osText", osText)
        $("#openingStatementText").html(osText)
        renderMathInElement(document.getElementById("openingStatementText"))
      })
    })

    this.get = function() {
      return $("#openingStatement").val()
    }.bind(this)

    this.set = function(openingStatement) {
      $("#openingStatement").val(openingStatement)
      $("#openingStatement").trigger("input")
    }.bind(this)
  }
)
riot.tag2(
  "pre-req",
  '<div class="field"> <label class="label">Prerequisite Topics (max. 4)</label> </div> <div class="field is-grouped" id="preReq"> <div class="control is-expanded"> <input class="input {is-danger: invalidPreReqTitle}" id="preReqTitle" type="text" placeholder="Topic Title" ref="preReqTitle"> <p show="{invalidPreReqTitle}" class="help is-danger">Title can\'t be empty</p> <p show="{tooManyPreReqs}" class="help is-danger">Max. number of Pre-Requisites reached (4)</p> </div> <div class="control is-expanded"> <input class="input {is-danger: invalidPreReqUrl}" id="preReqUrl" type="text" placeholder="Topic Url" ref="preReqUrl"> <p show="{invalidPreReqUrl}" class="help is-danger">Invalid Url</p> </div> <div class="control"> <a class="button is-success" onclick="{addPreReq}">Add</a> </div> </div> <div each="{preRequisites}" class="field"> <div class="control"> <a class="tag is-danger" onclick="{removePreReq}"> REMOVE </a> <span>{title} - {url}</span> </div> </div>',
  "",
  "",
  function(opts) {
    this.preRequisites = []
    this.invalidPreReqTitle = false
    this.invalidPreReqUrl = false
    this.tooManyPreReqs = false
    this.addPreReq = function() {
      if (this.preRequisites.length >= 4) {
        this.tooManyPreReqs = true
        this.emptyFields()
        return
      }
      var preReq = {
        title: this.refs.preReqTitle.value,
        url: this.refs.preReqUrl.value
      }
      console.log(preReq)
      this.tooManyPreReqs = false
      this.invalidPreReqTitle = isPreReqTitleInvalid(preReq.title)
      this.invalidPreReqUrl = isPreReqUrlInvalid(preReq.url)
      if (!this.invalidPreReqTitle && !this.invalidPreReqUrl) {
        this.preRequisites.push(preReq)
        console.log("PREREQ IS VALID")
        this.emptyFields()
        return
      }
      console.log("PREREQ IS INVALID")
    }.bind(this)

    this.emptyFields = function() {
      this.refs.preReqTitle.value = ""
      this.refs.preReqUrl.value = ""
    }.bind(this)

    this.removePreReq = function(event) {
      var item = event.item

      var index = this.preRequisites.indexOf(item)

      this.preRequisites.splice(index, 1)
    }.bind(this)

    function isPreReqTitleInvalid(title) {
      return $.trim(title) === ""
    }
    function isPreReqUrlInvalid(url) {
      var urlPattern = new RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm)
      return !urlPattern.test(url)
    }

    this.get = function() {
      return this.preRequisites
    }.bind(this)

    this.set = function(preReqs) {
      this.preRequisites = preReqs || []
    }.bind(this)
  }
)
riot.tag2(
  "resources",
  '<div class="field"> <label class="label">Resources (max. 4)</label> </div> <div class="field is-grouped" id="resource"> <div class="control is-expanded"> <input class="input {is-danger: invalidResourceTitle}" id="resourceTitle" type="text" placeholder="Resource Title" ref="resourceTitle"> <p show="{invalidResourceTitle}" class="help is-danger">Title can\'t be empty</p> <p show="{tooManyResources}" class="help is-danger">Max. number of resources reached (4)</p> </div> <div class="control is-expanded"> <input class="input {is-danger: invalidResourceUrl}" id="resourceUrl" type="text" placeholder="Resource Url" ref="resourceUrl"> <p show="{invalidResourceUrl}" class="help is-danger">Invalid Url</p> </div> <div class="control"> <a class="button is-success" onclick="{addResource}">Add</a> </div> </div> <div each="{resources}" class="field"> <div class="control"> <a class="tag is-danger" onclick="{removeResource}"> REMOVE </a> <span>{title} - {url}</span> </div> </div>',
  "",
  "",
  function(opts) {
    this.resources = []
    this.invalidResourceTitle = false
    this.invalidResourceUrl = false
    this.tooManyResources = false
    this.addResource = function() {
      if (this.resources.length === 4) {
        this.tooManyResources = true
        this.emptyFields()
        return
      }
      var resource = {
        title: this.refs.resourceTitle.value,
        url: this.refs.resourceUrl.value
      }
      console.log(resource)
      this.tooManyResources = false
      this.invalidResourceTitle = isResourceTitleInvalid(resource.title)
      this.invalidResourceUrl = isResourceUrlInvalid(resource.url)
      if (!this.invalidResourceTitle && !this.invalidResourceUrl) {
        this.resources.push(resource)
        console.log("Resource IS VALID")
        this.emptyFields()
        return
      }
      console.log("Resource IS INVALID")
    }.bind(this)

    this.removeResource = function(event) {
      var item = event.item

      var index = this.resources.indexOf(item)

      this.resources.splice(index, 1)
    }.bind(this)

    this.emptyFields = function() {
      this.refs.resourceTitle.value = ""
      this.refs.resourceUrl.value = ""
    }.bind(this)

    function isResourceTitleInvalid(title) {
      return $.trim(title) === ""
    }
    function isResourceUrlInvalid(url) {
      var urlPattern = new RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm)
      return !urlPattern.test(url)
    }

    this.get = function() {
      return this.resources
    }.bind(this)

    this.set = function(resources) {
      this.resources = resources || []
    }.bind(this)
  }
)
riot.tag2(
  "subject",
  '<div class="field"> <label class="label">Subject</label> <div class="control"> <div class="select"> <select id="subjectSelect"> <option value="Algebra">Algebra</option> <option value="Calculus">Calculus</option> <option value="Linear Algebra">Linear Algebra</option> <option value="Number Theory">Number Theory</option> <option value="Geometry">Geometry</option> <option value="Combinatorics">Combinatorics</option> </select> </div> </div> </div>',
  "",
  "",
  function(opts) {
    this.get = function() {
      return $("#subjectSelect option:selected").text()
    }.bind(this)
    this.set = function(subject) {
      console.log("subjectTag::subject", subject)
      $("#subjectSelect").val(subject)
    }.bind(this)
  }
)
riot.tag2(
  "table-of-contents",
  '<div class="field"> <label class="label">Table of Contents</label> </div> <div class="field is-grouped" id="preReq"> <div class="control is-expanded"> <input class="input {is-danger: invalidTitle}" id="title" type="text" placeholder="Section Name" ref="title"> <p show="{invalidTitle}" class="help is-danger">Title can\'t be empty</p> </div> <div class="control"> <a class="button is-success" onclick="{addTitle}">Add</a> </div> </div> <div each="{tableOfContents}" class="field"> <div class="control"> <span>- {title}</span> <a show="{isContent}" class="tag is-danger" onclick="{removeTitle}"> REMOVE </a> </div> </div>',
  "",
  "",
  function(opts) {
    this.tableOfContents = [
      { title: "Introduction" },
      { title: "Prerequisites" },
      { title: "Exercises" },
      { title: "Resources" }
    ]
    this.invalidTitle = false
    this.addTitle = function() {
      var content = {
        title: this.refs.title.value,
        isContent: true
      }
      console.log(content)
      this.invalidTitle = isTitleInvalid(content.title)
      if (!this.invalidTitle) {
        var insertIndex = this.tableOfContents.length - 2
        this.tableOfContents.splice(insertIndex, 0, content)
        console.log("Title IS VALID")
        this.refs.title.value = ""
        return
      }
      console.log("Title IS INVALID")
    }.bind(this)

    this.removeTitle = function(event) {
      var item = event.item

      var index = this.tableOfContents.indexOf(item)

      this.tableOfContents.splice(index, 1)
    }.bind(this)

    function isTitleInvalid(title) {
      return $.trim(title) === ""
    }

    this.get = function() {
      return this.tableOfContents
    }.bind(this)
    this.set = function(tableOfContents) {
      console.log("tableOfContents", tableOfContents)
      this.tableOfContents = tableOfContents
    }.bind(this)
  }
)
riot.tag2(
  "content-section",
  '<div class="box"> <div class="level"> <div class="level-right"> <span class="level-item moveHandle"> <span class="icon is-small"><i class="fa fa-bars" aria-hidden="true"></i></span> </span> <a class="level-item" onclick="{editSection}"> <span class="icon is-small has-text-info"><i class="fa fa-pencil" aria-hidden="true"></i></span> </a> <a class="level-item" onclick="{removeSection}"> <span class="icon is-small has-text-danger"><i class="fa fa-close" aria-hidden="true"></i></span> </a> </div></div> <div class="title is-4">{sectionTitle}</div> <div class="content"><p id="{sectionId}" class="previewText"></p></div> </div> <div class="modal {is-active: showModal}"> <div class="modal-background"></div> <div class="modal-card"> <header class="modal-card-head"> <p class="modal-card-title">Edit Section</p> <button class="delete" aria-label="close" onclick="{close}"></button> </header> <section class="modal-card-body"> <div class="field"> <div class="control"> <input type="text" id="{editTitleId}" class="input mathContent" placeholder="Section Title ie) Understanding Factoring"> </div> </div> <div class="field"> <div class="control"> <textarea id="{editSectionId}" class="textarea mathContent" placeholder="Edit section content"></textarea> </div> <br> <div class="control"> <label>Preview</label> <div class="box"> <p id="{editSectionTextId}" class="previewText"></p> </div> </div> </div> </section> <footer class="modal-card-foot"> <button class="button is-success" onclick="{saveChanges}">Save changes</button> <button class="button" onclick="{close}">Cancel</button> <p class="help has-text-grey">Remember to Save Tutorial State after you save your changes.</p> </footer> </div> </div>',
  "",
  "",
  function(opts) {
    console.log(this.opts)
    var that = this
    this.showModal = false
    this.sectionId = "content_" + this.opts.id
    this.sectionTitle = this.opts.sectionTitle
    this.sectionText = this.opts.sectionText

    this.editTitleId = "editContentTitle_" + this.opts.id
    this.editSectionId = "editContentSection_" + this.opts.id
    this.editSectionTextId = "editContentSectionText_" + this.opts.id

    this.on("mount", function() {
      this.opts.contentObservable.trigger("createdContentSection", this.opts.id, this)

      this.$("sectionId").html(this.sectionText)
      this.render(this.sectionId)

      this.$("editSectionId").on("input", function(e) {
        var contentVal = that.$("editSectionId").val()
        that.$("editSectionTextId").html(contentVal)
        that.render(that.editSectionTextId)
      })

      that.opts.contentObservable.on("deletedContentSection", function(contentId, contentIndex) {
        console.log("content obeservable deletedContentSection triggered", {
          contentId: contentId,
          contentIndex: contentIndex
        })
        if (contentIndex < that.opts.contentIndex) {
          console.log("an content was deleted before", that.sectionTitle, that.opts.contentIndex)
          that.opts.contentIndex -= 1
          console.log("an content was deleted after", that.sectionTitle, that.opts.contentIndex)
        }
      })

      that.opts.contentObservable.on("contentOrderUpdate", function(oldIndex, newIndex) {
        console.log("contentOrderUpdate triggered", { oldIndex: oldIndex, newIndex: newIndex })
        if (oldIndex === that.opts.contentIndex) {
          console.log("oldIndex === contentIndex")
          that.opts.contentIndex = newIndex
          console.log("after oldIndex === contentIndex", that.sectionTitle, that.opts.contentIndex)
          return
        }

        if (oldIndex > newIndex && newIndex <= that.opts.contentIndex && oldIndex > that.opts.contentIndex) {
          console.log("an content was moved up the list before", that.sectionTitle, that.opts.contentIndex)
          that.opts.contentIndex += 1
          console.log("an content was moved up the list after", that.sectionTitle, that.opts.contentIndex)
        } else if (oldIndex < newIndex && newIndex >= that.opts.contentIndex && oldIndex < that.opts.contentIndex) {
          console.log("an content was moved down the list before", that.sectionTitle, that.opts.contentIndex)
          that.opts.contentIndex -= 1
          console.log("an content was moved down the list after", that.sectionTitle, that.opts.contentIndex)
        } else {
          console.log("nothing happened for", that.sectionTitle, that.opts.contentIndex)
        }
      })
    })

    this.editSection = function() {
      this.showModal = true

      this.$("editTitleId").val(this.sectionTitle)
      this.$("editSectionId").val(this.sectionText)
      this.$("editSectionTextId").html(this.sectionText)
      this.render(this.editSectionTextId)
    }.bind(this)

    this.saveChanges = function() {
      var confirmChanges = confirm("Would you like to confirm these changes ?")
      if (confirmChanges) {
        this.updateContent()
        const showPrompt = false
        this.closeModal(false)
      }
    }.bind(this)

    this.updateContent = function() {
      this.sectionTitle = this.$("editTitleId").val()
      this.sectionText = this.$("editSectionId").val()
      this.$("sectionId").html(this.sectionText)
      this.render(this.sectionId)
    }.bind(this)

    this.close = function() {
      const showPrompt = true
      this.closeModal(showPrompt)
    }.bind(this)

    this.closeModal = function(showPrompt) {
      if (showPrompt) {
        var confirmClose = confirm(
          "Are you sure you want to close this edit view ? Any unsaved changes will be discarded."
        )
        if (confirmClose) {
          this.showModal = false
        }
      } else {
        this.showModal = false
      }
    }.bind(this)

    this.removeSection = function() {
      var confirmChanges = confirm("Are you sure you want to delete the chosen section ?")
      if (confirmChanges) {
        this.opts.contentObservable.trigger("deletedContentSection", this.opts.id, this.opts.contentIndex)
        this.unmount(true)
        $("#" + this.opts.id).remove()
      }
    }.bind(this)

    this.get = function() {
      return {
        id: this.opts.id,
        contentIndex: this.opts.contentIndex,
        title: this.sectionTitle,
        text: this.sectionText
      }
    }.bind(this)

    this.render = function(id) {
      try {
        renderMathInElement(document.getElementById(id))
      } catch (err) {}
    }.bind(this)

    this.$ = function(val) {
      return $("#" + this[val])
    }.bind(this)
  }
)
riot.tag2(
  "exercise-section",
  '<div class="box"> <div class="level"> <div class="level-right"> <span class="level-item"> <span class="icon is-small moveHandle"><i class="fa fa-bars" aria-hidden="true"></i></span> </span> <a class="level-item" onclick="{editExercise}"> <span class="icon is-small has-text-info"><i class="fa fa-pencil" aria-hidden="true"></i></span> </a> <a class="level-item" onclick="{removeExercise}"> <span class="icon is-small has-text-danger"><i class="fa fa-close" aria-hidden="true"></i></span> </a> </div> </div> <div class="exercise"><p id="{questionId}" class="previewText"></p></div> <br> <div class="exercise"><p id="{answerId}" class="previewText"></p></div> </div> <div class="modal {is-active: showModal}"> <div class="modal-background"></div> <div class="modal-card"> <header class="modal-card-head"> <p class="modal-card-title">Edit Exercise</p> <button class="delete" aria-label="close" onclick="{close}"></button> </header> <section class="modal-card-body"> <div class="field"> <div class="control"> <input type="text" id="{editQuestionId}" class="input mathContent" placeholder="edit exercise question"> </div> </div> <div class="field"> <div class="control"> <textarea id="{editAnswerId}" class="textarea mathContent" placeholder="edit exercise answer"></textarea> </div> <br> <div class="control"> <label>Question Preview</label> <div class="box"> <p id="{editQuestionTextId}" class="previewText"></p> </div> </div> <div class="control"> <label>Answer Preview</label> <div class="box"> <p id="{editAnswerTextId}" class="previewText"></p> </div> </div> </div> </section> <footer class="modal-card-foot"> <button class="button is-success" onclick="{saveChanges}">Save changes</button> <button class="button" onclick="{close}">Cancel</button> <p class="help has-text-grey">Remember to Save Tutorial State after you save your changes.</p> </footer> </div> </div>',
  "",
  "",
  function(opts) {
    var that = this
    console.log(this.opts)
    this.showModal = false

    this.answerId = "answer_" + this.opts.id
    this.questionId = "question_" + this.opts.id

    this.editQuestionId = "editQuestion_" + this.opts.id
    this.editQuestionTextId = "editQuestionText_" + this.opts.id

    this.editAnswerId = "editAnswer_" + this.opts.id
    this.editAnswerTextId = "editAnswerText_" + this.opts.id

    this.on("mount", function() {
      this.opts.exerciseObservable.trigger("createdExercise", this.opts.id, this)
      that.bindExerciseValues()

      that.$("editQuestionId").on("input", function(e) {
        var questionVal = that.$("editQuestionId").val()
        that.$("editQuestionTextId").html(questionVal)
        that.render(that.editQuestionTextId)
      })

      that.$("editAnswerId").on("input", function(e) {
        var answerVal = that.$("editAnswerId").val()
        that.$("editAnswerTextId").html(answerVal)
        that.render(that.editAnswerTextId)
      })

      that.opts.exerciseObservable.on("deletedExercise", function(exerciseId, exerciseIndex) {
        console.log("exercise obeservable deletedExercise triggered", {
          exerciseId: exerciseId,
          exerciseIndex: exerciseIndex
        })
        if (exerciseIndex < that.opts.exerciseIndex) {
          console.log("an exercise was deleted before", that.opts.question, that.opts.exerciseIndex)
          that.opts.exerciseIndex -= 1
          console.log("an exercise was deleted after", that.opts.question, that.opts.exerciseIndex)
        }
      })

      that.opts.exerciseObservable.on("exerciseOrderUpdate", function(oldIndex, newIndex) {
        console.log("exerciseOrderUpdate triggered", { oldIndex: oldIndex, newIndex: newIndex })
        if (oldIndex === that.opts.exerciseIndex) {
          console.log("oldIndex === exerciseIndex")
          that.opts.exerciseIndex = newIndex
          console.log("after oldIndex === exerciseIndex", that.opts.question, that.opts.exerciseIndex)
          return
        }

        if (oldIndex > newIndex && newIndex <= that.opts.exerciseIndex && oldIndex > that.opts.exerciseIndex) {
          console.log("an exercise was moved up the list before", that.opts.question, that.opts.exerciseIndex)
          that.opts.exerciseIndex += 1
          console.log("an exercise was moved up the list after", that.opts.question, that.opts.exerciseIndex)
        } else if (oldIndex < newIndex && newIndex >= that.opts.exerciseIndex && oldIndex < that.opts.exerciseIndex) {
          console.log("an exercise was moved down the list before", that.opts.question, that.opts.exerciseIndex)
          that.opts.exerciseIndex -= 1
          console.log("an exercise was moved down the list after", that.opts.question, that.opts.exerciseIndex)
        } else {
          console.log("nothing happened for", that.opts.question, that.opts.exerciseIndex)
        }
      })
    })

    this.bindExerciseValues = function() {
      this.$("questionId").html(this.opts.question)
      this.$("answerId").html(this.opts.answer)
      that.render(that.questionId)
      that.render(that.answerId)
    }.bind(this)

    this.editExercise = function() {
      this.showModal = true

      this.$("editQuestionId").val(this.opts.question)
      this.$("editQuestionTextId").html(this.opts.question)
      that.render(this.editQuestionTextId)

      this.$("editAnswerId").val(this.opts.answer)
      this.$("editAnswerTextId").html(this.opts.answer)
      that.render(this.editAnswerTextId)
    }.bind(this)

    this.saveChanges = function() {
      var confirmChanges = confirm("Would you like to confirm these changes ?")
      if (confirmChanges) {
        this.updateExercise()
        const showPrompt = false
        this.closeModal(showPrompt)
      }
    }.bind(this)

    this.updateExercise = function() {
      this.opts.question = this.$("editQuestionId").val()
      this.opts.questionText = this.$("editQuestionTextId").html()

      this.opts.answer = this.$("editAnswerId").val()
      this.opts.answerText = this.$("editAnswerTextId").html()

      this.$("questionId").html(this.opts.questionText)
      this.$("answerId").html(this.opts.answerText)
    }.bind(this)

    this.close = function() {
      const showPrompt = true
      this.closeModal(showPrompt)
    }.bind(this)

    this.closeModal = function(showPrompt) {
      if (showPrompt) {
        var confirmClose = confirm(
          "Are you sure you want to close this edit view ? Any unsaved changes will be discarded."
        )
        if (confirmClose) {
          this.showModal = false
        }
      } else {
        this.showModal = false
      }
    }.bind(this)

    this.removeExercise = function() {
      var confirmChanges = confirm("Are you sure you want to delete the chosen exercise ?")
      if (confirmChanges) {
        this.opts.exerciseObservable.trigger("deletedExercise", this.opts.id, this.opts.exerciseIndex)
        this.unmount(true)
        $(this.opts.id).remove()
      }
    }.bind(this)

    this.get = function() {
      return {
        id: this.opts.id,
        question: this.opts.question,
        answer: this.opts.answer,
        exerciseIndex: this.opts.exerciseIndex
      }
    }.bind(this)

    this.render = function(id) {
      try {
        renderMathInElement(document.getElementById(id))
      } catch (err) {}
    }.bind(this)

    this.$ = function(val) {
      return $("#" + this[val])
    }.bind(this)
  }
)
