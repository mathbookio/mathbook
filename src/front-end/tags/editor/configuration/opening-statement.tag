<opening-statement>
  <style>
  #openingStatementText{
    white-space: pre-wrap;
  }
  </style>
  <div class="field">
    <label class="label">Opening Statement</label>
    <div class="control">
      <textarea id="openingStatement" class="textarea mathContent" placeholder="a small and brief discussion of the topic being discussed"></textarea>
    </div>
    <br/>
    <div class="control">
    <label>Preview</label>
      <div class="box">
        <p id='openingStatementText' class="previewText"></p>
      </div>
    </div>
  </div>

  <script>
    var self = this

  this.on('mount', function() {
    
    $('#openingStatement').on('input', debounce(self.renderOpeningStatementPreview));
  })

  renderOpeningStatementPreview(){
    const osText = $('#openingStatement').val()
    $('#openingStatementText').html(osText)
    renderMathInElement(document.getElementById('openingStatementText'))
  }

  get(){
    return $('#openingStatement').val()
  }

  set(openingStatement) {
    $('#openingStatement').val(openingStatement)
    $('#openingStatement').trigger('input')
  }

  </script>
</opening-statement>