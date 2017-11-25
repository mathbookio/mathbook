<topic-title>
  <section class="section my-section-margin">
    <div class="title" itemprop='name'>{ topicTitle }</div>
    <div class="level">
      <div class="level-left">
        <div class="column" itemprop="breadcrumb" itemtype='http://schema.org/BreadcrumbList' itemscope=''>
          <span each={ breadcrumbs } itemprop="itemListElement">
            <a href={ url }> { title }</a> /
          </span>
          <span itemprop="itemListElement"> { topicTitle } </span>
        </div>
      </div>
    </div>
  </section>
  <script>
  var that = this
  this.breadcrumbs = this.opts.breadcrumbs || []
  this.topicTitle = this.opts.title || ''

  set(data){
    this.breadcrumbs = data['breadCrumbs']
    this.topicTitle = data['title']
  }
  </script>
</topic-title>