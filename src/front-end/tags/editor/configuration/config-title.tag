<config-title>
  <div class="field">
    <label class="label">Title</label>
    <div class="control">
      <input ref="tutorialTitle" class="input" type="text" placeholder="Tutorial Title"/>
    </div>
  </div>
  <script>
  var that = this
  get(){
    return this.refs.tutorialTitle.value
  }
  set(title){
    console.log('configTitle::set', title)
    this.refs.tutorialTitle.value = title
  }

  </script>
</config-title>