<table-contents>
  <section class="section my-section-margin">
    <div class="title is-4">Contents</div>
    <div class="content">
      <ol class="sans">
        <li each={ contentsList }>
          <a href={ fragment }>{ title }</a>
        </li>
      </ol>
    </div>
  </section>
  <script>
  var that = this
  this.contentsList = this.opts.contentsList || []
  set(data){
    this.contentsList = data['table-contents']
  }
  </script>
</table-contents>