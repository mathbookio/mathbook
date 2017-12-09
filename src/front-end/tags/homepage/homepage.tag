<homepage>
  <section class="hero is-info is-medium">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">Welcome to Mathbook</h1>
        <h2 class="subtitle">An online repository of peer-reviewed tutorials on topics covering most subjects in mathematics</h2>
      </div>
    </div>
  </section>
  <section class="section my-section-margin">
    <div class="container">
      <h3 class="title is-3">Browse Subjects</h3>
      <h5 class="subtitle is-5">Each subject contains tutorials covering certain topics created by the contributors of Mathbook.</h5>
    </div>
  </section>
  <section class="section my-section-margin">
    <div class="container">
      <div id="mathSubjects" class="tile is-ancestor is-vertical">
        <div class="title is-parent" each={ subjects }>
          <a href={ "/subject/" + id } class="tile is-child box notification { color }">
            <h3 class="title">{ title }</h3>
            <div class="content is-medium">
              <p>{ blurb }</p>
            </div>
            <span class="content is-medium my-subject-example">{ example }</span>
          </a>
        </div>
      </div>
    </div>
  </section>
  <section class="hero is-info">
    <div class="hero-body">
      <div class="container has-text-centered">
        <h4 class="title is-4">Math is a tool we use to help us measure the world around us.</h4>
        <h6 class="subtitle is-5">For this reason alone, the benefits of learning math are worthwhile.</h6>
      </div>
    </div>
  </section>
  <script>
    const that = this
    console.log('options',this.opts)
    this.subjects = this.opts.subjects
    this.on('mount', function(){
      renderMath('mathSubjects')
    })
  </script>
</homepage>