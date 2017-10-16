<keywords>
  <div class="field">
    <label class="label">Keywords <span class="normal">(max. 5)</span></label>
  </div>
  <div class="field is-grouped" id="preReq">
    <div class="control is-expanded">
      <input class="input {is-danger: invalidKeyword}" id="keyword" type='text' placeholder='Section Name'  ref="keyword" />
       <p show={ invalidKeyword } class="help is-danger">Keyword can't be empty</p>
       <p show={ tooManyKeywords } class="help is-danger">max. number of keywords reached (5).</p>
    </div>
    <div class="control">
      <a class="button is-success" onClick={ addKeyword }>Add</a>
    </div>
  </div>
  <div each={ keyword in keywords } class="field">
    <div class="control">
      <span> { keyword }</span>
      <a class="tag is-danger" onClick={ removeKeyword }> REMOVE </a>
    </div>
  </div>
  <script>
    this.keywords = []
    this.invalidKeyword = false // we don't want to show red input fields by default
    this.tooManyKeywords = false
    addKeyword() {

      var keyword = this.refs.keyword.value
      console.log(keyword)
      this.invalidKeyword = isKeywordInvalid(keyword)
      if (!this.invalidKeyword) {
        if (this.keywords.length >= 5) {
          this.tooManyKeywords = true
          return
        }
        this.tooManyKeywords = false
        var insertIndex = this.keywords.length - 2
        this.keywords.splice(insertIndex, 0, keyword)
        console.log("Keyword IS VALID")
        this.refs.keyword.value = ''
        return
      }
        console.log("Keyword IS INVALID")
      
    }

    removeKeyword(event) {
      // looped item
      var item = event.item

      // index on the collection
      var index = this.keywords.indexOf(item)

      // remove from collection
      this.keywords.splice(index, 1)
    }

    function isKeywordInvalid(keyword) {
      return ($.trim(keyword) === '')
    }

    get(){
      return this.keywords
    }
  </script>
</keywords>