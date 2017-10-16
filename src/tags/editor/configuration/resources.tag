<resources>
  <div class="field">
    <label class="label">Resources</label>
  </div>
  <div class="field is-grouped" id="resource">
    <div class="control is-expanded">
      <input class="input {is-danger: invalidResourceTitle}" id="resourceTitle" type='text' placeholder='Resource Title'  ref="resourceTitle" />
       <p show={ invalidResourceTitle } class="help is-danger">Title can't be empty</p>
    </div>
    <div class="control is-expanded">
      <input class="input {is-danger: invalidResourceUrl}" id="resourceUrl" type='text' placeholder='Resource Url' ref="resourceUrl" />
       <p show={ invalidResourceUrl } class="help is-danger">Invalid Url</p>
    </div>
    <div class="control">
      <a class="button is-success" onClick={ addResource }>Add</a>
    </div>
  </div>
  <div each={ resources } class="field">
    <div class="control">
      <a class="tag is-danger" onClick={ removeResource }> REMOVE </a>
      <span>{ title } - { url }</span>
    </div>
  </div>
  <script>
    this.resources = []
    this.invalidResourceTitle = false // default
    this.invalidResourceUrl = false // we don't want to show red input fields by default
    addResource() {
      var resource = {
        title: this.refs.resourceTitle.value,
        url: this.refs.resourceUrl.value
      }
      console.log(resource)
      this.invalidResourceTitle = isResourceTitleInvalid(resource.title)
      this.invalidResourceUrl = isResourceUrlInvalid(resource.url)
      if (!this.invalidResourceTitle && !this.invalidResourceUrl) {
        this.resources.push(resource)
        console.log("Resource IS VALID")
        this.refs.resourceTitle.value = ''
        this.refs.resourceUrl.value = ''
        return
      }
        console.log("Resource IS INVALID")
      
    }

    removeResource(event) {
      // looped item
      var item = event.item

      // index on the collection
      var index = this.resources.indexOf(item)

      // remove from collection
      this.resources.splice(index, 1)
    }

    function isResourceTitleInvalid(title) {
      return ($.trim(title) === '')
    }
    function isResourceUrlInvalid(url) {
      var urlPattern = new RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm)
      return (!urlPattern.test(url))
    }

    get(){
      return this.resources
    }
  </script>
</resources>