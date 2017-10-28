<exercise-statement>
  <div class="field">
    <label class="label">Exercises' Statement</label>
    <div class="control">
      <input id="exerciseStatement" class="input mathContent" type='text' placeholder='e.g. Solve for \\(y\\) for the following exercises'/>
    </div>
    <br/>
    <div class="control">
      <label>Preview</label>
      <div class="box">
        <p id='exerciseStatementText'></p>
      </div>
    </div>
  </div>

  <script>
    var that = this

  this.on('mount', function() {
    
    $('#exerciseStatement').on('input', function(e) {
      var osText = $('#exerciseStatement').val()
      console.log('osText', osText)
      $('#exerciseStatementText').html(osText)
      MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'exerciseStatementText'])
    });
  })

  get(){
    return $('#exerciseStatementText').html()
  }

  </script>
</exercise-statement>