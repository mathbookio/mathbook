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
    return that.refs.tutorialTitle.value
  }

  </script>
</config-title>