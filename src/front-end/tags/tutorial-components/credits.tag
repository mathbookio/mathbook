<credits>
<section class="section my-section-margin">
<div class="container is-fluid">
    <div class="content serif">
      <p id="credits" itemprop="description" class="preWrap"> { credits } </p>
    </div>
    </div>
  </section>
  <script>
  var self = this
  this.author = this.opts.author || ''
  this.credits = ''

  set(data){
    this.author = data['author']
    this.credits = 'Created by ' + this.author
  }

  </script>
</credits>