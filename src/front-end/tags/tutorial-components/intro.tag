<intro>
<section class="section my-section-margin">
<div class="container is-fluid">
    <div class="title is-4">Introduction</div>
    <div class="content serif">
      <p id="openingStatement" itemprop="description" class="preWrap">{ openingStatement }</p>
    </div>
    </div>
  </section>
  <script>
  var self = this
  this.openingStatement = this.opts.openingStatement || ''
  
  this.on('mount', function() {
    this.updateOpeningStatement()
  })

  set(data){
    this.openingStatement = data['openingStatement']
    this.updateOpeningStatement()
  }

  updateOpeningStatement(){
    $('#openingStatement').html(this.openingStatement)
  }

  </script>
</intro>