<credits>
<section class="section my-section-margin">
<div class="container is-fluid">
    <div class="content serif">
      <p id="credits" itemprop="description" class="preWrap"> { credits }</p>
    </div>
    </div>
  </section>
  <script>
  var self = this
  this.credits = this.opts.author || ''
  
  this.on('mount', function() {
    this.updatecredits()
  })

  set(data){
    this.credits = data['author']
    this.updatecredits()
  }

  updatecredits(){
    if(this.credits)
      $('#credits').html('Created with &heartsuit; by ' + this.credits)
  }

  </script>
</credits>