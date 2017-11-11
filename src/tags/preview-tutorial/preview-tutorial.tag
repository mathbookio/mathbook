<preview-tutorial>
  <topic-title></topic-title>
  <intro></intro>
  <pre-reqs></pre-reqs>
  <table-contents></table-contents>
  <resource-list></resource-list>
  <!--  TODO - ADD KEYWORDS META DATA FOR SEO PURPOSES  -->
  <script>
    var that = this
    this.tutorialName = ''
    this.config = {}
    this.on('mount', function () {
      const urlPaths = window.location.href.split('/')
      console.log('url paths', urlPaths)
      this.tutorialName = urlPaths.pop()
      const url = '/v1/tutorial/' + this.tutorialName
      $.get(url, function (result) {
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
          // that.formatContent(result.content),
          // that.formatExercises(result.exercises)
          that.update()
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

      console.log('config', config)

      this.config = config
      this.tags['topic-title'].set(config)
      this.tags['intro'].set(config)
      this.tags['pre-reqs'].set(config)
      this.tags['table-contents'].set(config)
      this.tags['resource-list'].set(config)

    }

    toSnakeCase(text) {
      return text.replace(/\s+/g, '-').toLowerCase()
    }
  </script>
</preview-tutorial>