<configuration id="configComponent">
  <section class="section">
    <div class="container">
      <h5 class="title">Configuration</h5>
      <subject></subject>
      <br/>
      <config-title></config-title>
      <br/>
      <opening-statement></opening-statement>
      <br/>
      <pre-req></pre-req>
      <br/>
      <exercise-statement></exercise-statement>
      <br/>
      <resources></resources>
      <br/>
      <keywords></keywords>
      <br/>
      <author></author>
  </section>
  <script>

    this.tabObservable = this.opts.observable

    this.on('mount', function() {
        this.tabObservable.on('show', function(type){
          if (type === 'config'){
            $('#configComponent').show()
          }
          else{
            $('#configComponent').hide()
          }
        })
    })


    get(){
      return {
        subject: this.tags['subject'].get(),
        title: this.tags['config-title'].get(),
        openingStatement: this.tags['opening-statement'].get(),
        preReqs: this.tags['pre-req'].get(),
        exerciseStatement: this.tags['exercise-statement'].get(),
        resources: this.tags['resources'].get(),
        keywords: this.tags['keywords'].get(),
        author: this.tags['author'].get()
      }
    }
    set(data){
        this.tags['subject'].set(data['subject'])
        this.tags['config-title'].set(data['title'])
        this.tags['opening-statement'].set(data['openingStatement'])
        this.tags['pre-req'].set(data['preReqs'])
        this.tags['exercise-statement'].set(data['exerciseStatement'])
        this.tags['resources'].set(data['resources'])
        this.tags['keywords'].set(data['keywords'])
        this.tags['author'].set(data['author'])
    }
  </script>
</configuration>
