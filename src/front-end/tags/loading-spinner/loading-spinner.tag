<loading-spinner>
  <div show={ opts.loadingFlag } class="column has-text-centered has-text-grey">
        <p> { opts.text } 
          <span class="icon is-medium">
            <i class="fa fa-cog fa-spin"></i>
          </span>
        </p>
  </div>
  <script>
    var self = this
    console.log(this.opts)
  </script>
</loading-spinner>