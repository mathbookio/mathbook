<author>
  <div class="field">
    <label class="label">Author</label>
    <div class="control">
      <input ref="author" class="input" type="text" placeholder="Your name"/>
    </div>
  </div>
  <script>
  var self = this
  get(){
    return this.refs.author.value
  }
  set(title){
    this.refs.author.value = title || ''
  }

  </script>
</author>
