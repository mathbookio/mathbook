<exercise-statement>
  <div class="field">
    <label class="label">Exercises' Statement</label>
    <div class="control">
      <input id="exerciseStatement" class="autoSaveInput input mathContent" type='text' placeholder='e.g. Solve for \\(y\\) for the following exercises'/>
    </div>
    <br/>
    <div class="control">
      <label>Preview</label>
      <div class="box">
        <p id='exerciseStatementText' class="previewText"></p>
      </div>
    </div>
  </div>

  <script>
    var self = this

  this.on('mount', function() {
    
    $('#exerciseStatement').on('input', debounce(self.renderExerciseStatementPreview));
  })

  renderExerciseStatementPreview(){
    const osText = $('#exerciseStatement').val()
    $('#exerciseStatementText').html(osText)
    renderMathInElement(document.getElementById('exerciseStatementText'))
  }
  get(){
    return $('#exerciseStatement').val()
  }
  set(statement){
    $('#exerciseStatement').val(statement)
    $('#exerciseStatement').trigger('input')
  }

  </script>
</exercise-statement>