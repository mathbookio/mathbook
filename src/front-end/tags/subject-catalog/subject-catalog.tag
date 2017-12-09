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
    var that = this
    console.log('subject catalog options', this.opts)
    this.subject = this.opts.subject || ''
    this.subjectData = {}
    this.topics = []
    this.on('mount', function(){
      const url = '/v1/subject/' + this.subject
      $.get(url, function(result){
        console.log('got a result from url', url)
        console.log(result)
        that.topics = result.topics
        that.subjectData = result.subjectData
        that.update()
      })
      .fail(function (error) {
        console.log('failed to get anything from url', url)
        console.log(error)
        handleError(error)
      })
    })
  </script>
</subject-catalog>