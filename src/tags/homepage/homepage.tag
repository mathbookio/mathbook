<homepage>
  <section class="hero is-info is-medium">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">Welcome to Mathbook</h1>
        <h2 class="subtitle">An online resource for tutorials on topics covering all subjects in mathematics</h2>
      </div>
    </div>
  </section>
  <section class="section my-section-margin">
    <div class="container">
      <h3 class="title is-3">Select A Subject To Get Started</h3>
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
  <section class="hero is-light is-bold">
    <div class="hero-body">
      <div class="container has-text-centered">
        <h1 class="title">Math is a tool created to help us measure the world around us.</h1>
        <h2 class="subtitle">For that reason alone, math is worth learning</h2>
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