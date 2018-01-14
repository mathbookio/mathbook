<table-contents>
  <section class="section my-section-margin">
  <div class="container is-fluid">
    <div class="title is-4">Contents</div>
    <div class="content">
      <ol class="sans">
        <li each={ contentsList }>
          <a href={ fragment }>{ title }</a>
        </li>
      </ol>
    </div>
    </div>
  </section>
  <script>
  var self = this
  this.contentsList = this.opts.contentsList || []
  set(data){
    this.contentsList = data['table-contents']
  }
  </script>
</table-contents>