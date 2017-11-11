<resource-list>
    <section class="section my-section-margin">
    <div class="title is-4">Resources</div>
    <div class="content">
      <ul>
        <li each={ resourceList }>
          <a href={ url } target="_blank">{ title }</a>
        </li>
      </ul>
    </div>
  </section>
  <script>
  var that = this
  this.resourceList = this.opts.resourceList || []
  set(data){
    this.resourceList = data['resources']
  }
  </script>
</resource-list>