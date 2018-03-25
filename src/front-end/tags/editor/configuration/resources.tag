<resources>
  <div class="field">
    <label class="label">Resources (max. 4)</label>
  </div>
  <div class="field is-grouped" id="resource">
    <div class="control is-expanded">
      <input class="autoSaveInput input {is-danger: invalidResourceTitle}" id="resourceTitle" type='text' placeholder='Resource Title'  ref="resourceTitle" />
       <p show={ invalidResourceTitle } class="help is-danger">Title can't be empty</p>
       <p show={ tooManyResources } class="help is-danger">Max. number of resources reached (4)</p>
    </div>
    <div class="control is-expanded">
      <input class="autoSaveInput input {is-danger: invalidResourceUrl}" id="resourceUrl" type='text' placeholder='Resource Url' ref="resourceUrl" />
       <p show={ invalidResourceUrl } class="help is-danger">Invalid Url</p>
    </div>
    <div class="control">
      <a class="autoSaveButton button is-success" onClick={ addResource }>Add</a>
    </div>
  </div>
  <div each={ resources } class="field">
    <div class="control">
      <a class="autoSaveButton tag is-danger" onClick={ removeResource }> REMOVE </a>
      <span>{ title } - { url }</span>
    </div>
  </div>
  <script>
    this.resources = []
    this.invalidResourceTitle = false // default
    this.invalidResourceUrl = false // we don't want to show red input fields by default
    this.tooManyResources = false
    addResource() {
      if (this.resources.length === 4){
        this.tooManyResources = true
        this.emptyFields()
        return 
      }
      var resource = {
        title: this.refs.resourceTitle.value,
        url: this.refs.resourceUrl.value
      }
      this.tooManyResources = false
      this.invalidResourceTitle = isResourceTitleInvalid(resource.title)
      this.invalidResourceUrl = isResourceUrlInvalid(resource.url)
      if (!this.invalidResourceTitle && !this.invalidResourceUrl) {
        this.resources.push(resource)
        this.emptyFields()
        return
      }
      
    }

    removeResource(event) {
      // looped item
      var item = event.item

      // index on the collection
      var index = this.resources.indexOf(item)

      // remove from collection
      this.resources.splice(index, 1)
      $('.autoSaveButton').trigger('mouseup')
    }

    emptyFields(){
      this.refs.resourceTitle.value = ''
      this.refs.resourceUrl.value = ''
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

    set(resources){
      this.resources = resources || []
    }
  </script>
</resources>