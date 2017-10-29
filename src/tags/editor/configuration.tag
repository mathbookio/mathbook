<configuration>
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
      <table-of-contents></table-of-contents>
      <br/>
      <exercise-statement></exercise-statement>
      <br/>
      <resources></resources>
      <br/>
      <keywords></keywords>
  </section>
  <script>
    get(){
      return {
        subject: this.tags['subject'].get(),
        title: this.tags['config-title'].get(),
        openingStatement: this.tags['opening-statement'].get(),
        preReqs: this.tags['pre-req'].get(),
        tableOfContents: this.tags['table-of-contents'].get(),
        exerciseStatement: this.tags['exercise-statement'].get(),
        resources: this.tags['resources'].get(),
        keywords: this.tags['keywords'].get()
      }
    }
    set(data){
        this.tags['subject'].set(data['subject'])
        this.tags['config-title'].set(data['title'])
        this.tags['opening-statement'].set(data['openingStatement'])
        this.tags['pre-req'].set(data['preReqs'])
        this.tags['table-of-contents'].set(data['tableOfContents'])
        this.tags['exercise-statement'].set(data['exerciseStatement'])
        this.tags['resources'].set(data['resources'])
        this.tags['keywords'].set(data['keywords'])
    }
  </script>
</configuration>
