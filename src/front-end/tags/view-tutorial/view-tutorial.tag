<view-tutorial>
<loading-spinner loading-flag={ isLoading } text={ loadingText }></loading-spinner>
  <div hide={ isLoading }>
    <topic-title></topic-title>
    <intro></intro>
    <pre-reqs></pre-reqs>
    <table-contents></table-contents>
    <tutorial-sections></tutorial-sections>
    <tutorial-exercises></tutorial-exercises>
    <resource-list></resource-list>
    <meta-keywords></meta-keywords>
  </div>
  <script>
    var self = this
    this.loadingText = 'Loading Tutorial...just a sec.'
    this.isLoading = true

    this.tutorialName = this.opts.tutorialName || ''
    this.tutorialSubject = this.opts.subject || ''
    this.config = {}
    this.sections = []
    this.exercises = []
    this.on('mount', function () {
      const url = '/v1/tutorial/local/' + this.tutorialSubject + '/' + this.tutorialName
      $.get(url, function (result) {
        result.config['table-contents'] = []
        for (var section of result.content){
          const sectionTitle = section['title']
          const fragment = '#' + self.toSnakeCase(sectionTitle)
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
        self.formatConfig(result.config),
        self.formatContent(result.content),
        self.formatExercises(result.exercises, result.config.exerciseStatement)
        self.update()
        renderMathInElement(document.body)
      })
      .fail(function (res){
        handleError(res)
      })
      .always(function() {
        self.isLoading = false
        self.update()
      });

    })

    formatConfig(config) {
      config['breadCrumbs'] = [{
          title: 'Home',
          url: '/'
        },
        {
          title: config.subject,
          url: '/subject/' + this.toSnakeCase(config.subject)
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
        section['fragment'] = self.toSnakeCase(section.title)
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
</view-tutorial>