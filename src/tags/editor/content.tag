<content>
  <style>
    #contentSectionText{
      white-space: pre-wrap;
    }
  </style>
  <section class="section">
    <div id="contentContainer" class="container">
      <h5 class="title">Content</h5>
      <h6 class="subtitle">The content explains the 'What', 'Why' and 'How'</h6>
  
  <div class="field">
    <div class="control">
      <input type="text" id="contentTitle" class="input" placeholder="Section Title ie) Understanding Factoring"/>
    </div>
  </div>
  <div class="field">
    <div class="control">
      <textarea id="contentSection" class="textarea" placeholder="Consider this one section"></textarea>
    </div>
    <br/>
    <div class="control">
    <label>Preview</label>
      <div class="box">
        <p id='contentSectionText'></p>
      </div>
    </div>
  </div>
  <div class="control">
    <a class="button is-info" onclick={ saveSection }>Save Section</a>
  </div>
  <br/>
    </div>
  </section>
  
  <script>
    var that = this

  this.on('mount', function() {
    
    $('#contentSection').on('input', function(e) {
      var osText = $('#contentSection').val()
      console.log('osText', osText)
      $('#contentSectionText').html(osText)
      MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'contentSectionText'])
    });
  })

  saveSection(){
    var sectionNumber = $('.box').length
    var sectionId = 'sectionBox_'+sectionNumber

    var sectionTitle = $('#contentTitle').val()
    var sectionText = $('#contentSection').val()
    var sectionContent = $('#contentSectionText').html()
    $('#contentContainer').append('<content-section id="'+sectionId+'"></content-section>')
    riot.mount('#'+sectionId, { sectionTitle: sectionTitle, sectionContent: sectionContent, sectionText: sectionText })
    this.cleanupFields()
  }

  cleanupFields(){
    $('#contentTitle').val('')
    $('#contentSection').val('')
    $('#contentSectionText').html('')
  }

  </script>
</content>