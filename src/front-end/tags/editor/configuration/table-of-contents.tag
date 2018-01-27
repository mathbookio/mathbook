<table-of-contents>
  <div class="field">
    <label class="label">Table of Contents</label>
  </div>
  <div class="field is-grouped" id="preReq">
    <div class="control is-expanded">
      <input class="input {is-danger: invalidTitle}" id="title" type='text' placeholder='Section Name'  ref="title" />
       <p show={ invalidTitle } class="help is-danger">Title can't be empty</p>
    </div>
    <div class="control">
      <a class="button is-success" onClick={ addTitle }>Add</a>
    </div>
  </div>
  <div each={ tableOfContents } class="field">
    <div class="control">
      <span>- { title }</span>
      <a show={ isContent } class="tag is-danger" onClick={ removeTitle }> REMOVE </a>
    </div>
  </div>
  <script>
    this.tableOfContents = [
      { title: 'Introduction' },
      { title: 'Prerequisites' },
      { title: 'Exercises' },
      { title: 'Resources' }
    ]
    this.invalidTitle = false // we don't want to show red input fields by default
    addTitle() {
      var content = {
        title: this.refs.title.value,
        isContent: true
      }
      this.invalidTitle = isTitleInvalid(content.title)
      if (!this.invalidTitle) {
        var insertIndex = this.tableOfContents.length - 2
        this.tableOfContents.splice(insertIndex, 0, content)
        this.refs.title.value = ''
        return
      }
      
    }

    removeTitle(event) {
      // looped item
      var item = event.item

      // index on the collection
      var index = this.tableOfContents.indexOf(item)

      // remove from collection
      this.tableOfContents.splice(index, 1)
    }

    function isTitleInvalid(title) {
      return ($.trim(title) === '')
    }

    get(){
      return this.tableOfContents
    }
    set(tableOfContents){
      this.tableOfContents = tableOfContents
    }
  </script>
</table-of-contents>