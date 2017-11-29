<intro>
<section class="section my-section-margin">
<div class="container is-fluid">
    <div class="title is-4">Introduction</div>
    <div class="content serif">
      <p itemprop="description">{ openingStatement }</p>
    </div>
    </div>
  </section>
  <script>
  var that = this
  this.openingStatement = this.opts.openingStatement || ''

  set(data){
    this.openingStatement = data['openingStatement']
  }

  </script>
</intro>