<subject-catalog>

  <section class="section my-section-margin">
    <div class="container">
      <div class="heading">
        <h1 class="title">{ subjectData.title }</h1>
      </div>
      <h5 class="title is-5">{ subjectData.blurb }</h5>
    </div>
  </section>
  
  <section class="section my-section-margin">
    <div class="container">
      <h3 class="title is-3">Please a select a topic from below</h3>
    </div>
  </section>
  
  <section class="section my-section-margin">
    <div class="container">
      <div show="{ topics.length === 0 }" class=" has-text-centered has-text-grey">
        <p>Hey, we couldn't find any tutorials for this subject at the moment. Sorry.
        <br/>
        If you want, you can build a tutorial and have it shown here for others to learn from and share! 
          <span class="icon is-small">
            <i class="fa fa-smile-o"></i>
          </span>
          </br>
          <a href="/contribute">Learn about becoming a contributor of Mathbook.</a>
        </p>
      </div>
      <div show="{ topics.length > 0 }" class="tile is-ancestor">
        <div class="tile is-parent is-vertical">
          <div each={ topics }>
            <topic-box color={ color } link={ link } statement={ statement } title={ title } subject={ subject }></topic-box>
            <br/>
          </div>
        </div>
      </div>
    </div>
  </section>

  <script>
    var self = this
    this.subject = this.opts.subject || ''
    this.subjectData = {}
    this.topics = []
    this.on('mount', function(){
      console.log("MOUNTED SUBJECT LOG")
      const url = '/v1/subject/' + this.subject
      $.get(url, function(result){
        const data = result.data
        self.topics = data.topics
        self.subjectData = data.subjectData
        self.update()
      })
      .fail(function (error) {
        handleError(error)
      })
    })
  </script>
</subject-catalog>