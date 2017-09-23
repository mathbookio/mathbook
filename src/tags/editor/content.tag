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
      <input type="text" id="contentTitle" class="input mathContent {is-danger: isTitleEmpty}" placeholder="Section Title ie) Understanding Factoring"/>
       <p show={ isTitleEmpty } class="help is-danger">Title can't be empty</p>
    </div>
  </div>
  <div class="field">
    <div class="control">
      <textarea id="contentSection" class="textarea mathContent {is-danger: isContentEmpty}" placeholder="section content..."></textarea>
       <p show={ isContentEmpty } class="help is-danger">The content section can't be empty</p>
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
    <div id="sectionList"></div>
    </div>
  </section>
  
  <script>
    var that = this
    this.isTitleEmpty = false
    this.isContentEmpty = false

  this.on('mount', function() {
    that.initSortable()

    $('#contentSection').on('input', function(e) {
      var contentVal = $('#contentSection').val()
      $('#contentSectionText').html(contentVal)
      MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'contentSectionText'])
    });
  })

  initSortable(){
    var sectionList = document.getElementById('sectionList')
    Sortable.create(sectionList, { handle: '.moveHandle' });
  }

  saveSection(){
    var sectionNumber = this.uniqueId()
    var sectionId = 'sectionBox_'+sectionNumber

    var sectionTitle = $('#contentTitle').val()
    var sectionText = $('#contentSection').val()
    var sectionContent = $('#contentSectionText').html()

    this.isTitleEmpty = this.isTextEmpty(sectionTitle)
    this.isContentEmpty = this.isTextEmpty(sectionText)
    if (this.isTitleEmpty || this.isContentEmpty){
      return
    }

    $('#sectionList').append('<content-section id="'+sectionId+'"></content-section>')
    riot.mount('#'+sectionId, { sectionTitle: sectionTitle, sectionContent: sectionContent, sectionText: sectionText })
    this.cleanupFields()
  }

  cleanupFields(){
    $('#contentTitle').val('')
    $('#contentSection').val('')
    $('#contentSectionText').html('')
  }

  isTextEmpty(text){
    return ($.trim(text) === '')
  }

  uniqueId() {
    return Math.random().toString(36).substr(2, 10);
  };

  </script>
</content>