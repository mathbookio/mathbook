<review-tutorial>
<section class="section">
  <div class="container">
    <div class="content">
      <div class="title is-5">You are now reviewing the tutorial: { tutorialName }</div>
    </div>
  </div>
</section>
    <topic-title></topic-title>
    <intro></intro>
    <pre-reqs></pre-reqs>
    <table-contents></table-contents>
    <tutorial-sections></tutorial-sections>
    <tutorial-exercises></tutorial-exercises>
    <resource-list></resource-list>
    <meta-keywords></meta-keywords>
  <script>
    var that = this
    this.tutorialName = ''
    this.config = {}
    this.error = {}
    this.isError = false
    this.sections = []
    this.exercises = []
    this.comments = []
    this.on('mount', function () {
      const urlPaths = window.location.href.split('/')
      console.log('url paths', urlPaths)
      this.tutorialName = urlPaths.pop()
      this.userName = urlPaths.pop()
      const url = '/v1/tutorial/'+ this.userName + '/' + this.tutorialName
      $.get(url, function (result) {
        this.isError = false
        console.log('getTutorialData result', result)
        result.config['table-contents'] = []
        for (var section of result.content){
          const sectionTitle = section['title']
          const fragment = '#' + that.toSnakeCase(sectionTitle)
          result.config['table-contents'].push({ title: sectionTitle, fragment: fragment })
        }
        result.config['table-contents'].push({
          title: 'Exercises',
          fragment: '#exercises'
        })
        result.config['table-contents'].push({
          title: 'Resources',
          fragment: '#resources'
        })
        that.formatConfig(result.config),
        that.formatContent(result.content),
        that.formatExercises(result.exercises, result.config.exerciseStatement)
        that.update()
        renderMathInElement(document.body)
      })
      .fail(function(error) {
        console.log(error)
        if (error.status === 404){
          window.location.href = '/404'
          return
        }
      })
    })

    formatConfig(config) {
      config['breadCrumbs'] = [{
          title: 'Home',
          url: '/'
        },
        {
          title: config.subject,
          url: '/' + this.toSnakeCase(config.subject)
        }
      ]

      this.tags['topic-title'].set(config)
      this.tags['intro'].set(config)
      this.tags['pre-reqs'].set(config)
      this.tags['table-contents'].set(config)
      this.tags['resource-list'].set(config)
      this.tags['meta-keywords'].set(config)

    }

    formatContent(sections){
      for(var section of sections){
        section['fragment'] = that.toSnakeCase(section.title)
      }
      this.tags['tutorial-sections'].set(sections)
    }

    formatExercises(exercises, exerciseStatement){
      for(var exercise of exercises){
        exercise['showAnswer'] = false
      }
      this.tags['tutorial-exercises'].set({ exercises: exercises, exerciseStatement: exerciseStatement })
    }

    toSnakeCase(text) {
      const txt = text || ''
      return txt.replace(/\s+/g, '-').toLowerCase()
    }
  </script>
</review-tutorial>