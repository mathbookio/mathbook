<pre-reqs>
  <section class="section my-section-margin">
  <div class="container is-fluid">
    <div class="title is-4">Prerequisites</div>
    <div class="content serif">
      <p>
      The list of concepts that are required knowledge for this topic.
      It is important that you understand these concepts before diving in.
      </p>
      <ul>
        <li class="sans" each={ preReqs }>
          <a itemprop='relatedLink' href={ url } target='_blank'>
            { title }
          </a>
        </li>
      </ul>
    </div>
    </div>
  </section>
  <script>
  var that = this
  this.preReqs = this.opts.preReqs || []
  
  set(data){
    this.preReqs = data['preReqs']
  }
  </script>
</pre-reqs>