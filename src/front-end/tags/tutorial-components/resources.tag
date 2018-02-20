<resource-list>
    <section class="section my-section-margin">
    <div class="container is-fluid">
    <div class="title is-4">Resources</div>
    <div class="content serif">
      <ul>
        <li class="sans" each={ resourceList }>
          <a href={ url } target="_blank">{ title }</a>
        </li>
      </ul>
    </div>
    </div>
  </section>
  <script>
  var self = this
  this.resourceList = this.opts.resourceList || []
  set(data){
    this.resourceList = data['resources']
  }
  </script>
</resource-list>