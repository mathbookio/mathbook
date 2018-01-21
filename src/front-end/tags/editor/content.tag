<content id="contentComponent">
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
      <a class="button" onclick={ showChartModal }>Insert Chart</a>
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
        <p id='contentSectionText' class="previewText"></p>
      </div>
    </div>
  </div>
  <div class="control">
    <a class="button is-info" onclick={ saveSection }>Add Section</a>
  </div>
  <br/>
    <div id="sectionList"></div>
    </div>
  </section>
  
  <script>
    var self = this
    this.clientId = 'content'
    this.contentMap = {}
    this.chartList = []
    this.isTitleEmpty = false
    this.isContentEmpty = false
    this.showChartModal = false
    this.tabObservable = this.opts.observable
    this.chartObservable = this.opts.chartObservable
    this.contentObservable = riot.observable()

  this.on('mount', function() {
    console.log('content component', this.opts)
    self.initSortable()
    
    this.tabObservable.on('show', function(type){
      if (type === 'content'){
        $('#contentComponent').show()
        self.contentObservable.trigger('renderCharts')
      }
      else{
        $('#contentComponent').hide()
      }
    })

    this.contentObservable.on('createdContentSection', function(contentId, contentObj) {
      self.contentMap[contentId] = contentObj
    })
    
    this.contentObservable.on('deletedContentSection', function(contentId) {
      delete self.contentMap[contentId]
    })

    this.chartObservable.on('savedChart', function(clientId, chartSize, chartData, chartOptions) {
      if (clientId !== self.clientId){
        return
      }
      const newChartId = uniqueId()
      
      const currentContentSection = $('#contentSection').val()
      const appendDiv = '<div id="'+newChartId+'" class="ct-chart '+chartSize+'"></div>'
      $('#contentSection').val(currentContentSection + ' ' + appendDiv)
      self.chartList.push({ id: newChartId, data: chartData, options: chartOptions })
      console.log('self.chartList', self.chartList)
      $('#contentSection').trigger('input')
    })

    $('#contentSection').on('input', function(e, newChart) {
      var contentVal = $('#contentSection').val()
      $('#contentSectionText').html(contentVal)
      renderMathInElement(document.getElementById('contentSectionText'))
      renderCharts(self.chartList)
    })

  })

  initSortable(){
    var sectionList = document.getElementById('sectionList')
    Sortable.create(sectionList, { 
      handle: '.moveHandle',
      onUpdate: function(e){
        self.contentObservable.trigger('contentOrderUpdate', e.oldIndex, e.newIndex)

      } });
  }

  saveSection(){
    var sectionNumber = uniqueId()
    var sectionId = 'sectionBox_'+sectionNumber

    var sectionTitle = $('#contentTitle').val()
    var sectionText = $('#contentSection').val()
    var sectionCharts = this.chartList

    this.isTitleEmpty = this.isTextEmpty(sectionTitle)
    this.isContentEmpty = this.isTextEmpty(sectionText)
    if (this.isTitleEmpty || this.isContentEmpty){
      return
    }
    this.generateSection(sectionId, sectionTitle, sectionText, sectionCharts)
  }

  generateSection(sectionId, sectionTitle, sectionText, sectionCharts){
    const contentIndex = $('content-section').length
    $('#sectionList').append('<content-section ref="'+sectionId+'" id="'+sectionId+'"></content-section>')
    console.log('chartObservable generateSection', this.contentObservable, self.chartObservable)
    riot.mount('#'+sectionId, 'content-section', { contentObservable: this.contentObservable, chartObservable: this.chartObservable, contentIndex: contentIndex, sectionTitle: sectionTitle, sectionText: sectionText, sectionCharts: sectionCharts })[0]
    this.cleanupFields()
    this.update()
  }
  
  cleanupFields(){
    $('#contentTitle').val('')
    $('#contentSection').val('')
    $('#contentSectionText').html('')
    this.chartList = []

  }

  showChartModal(){
    this.chartObservable.trigger('showChartModal', self.clientId)
  }

  isTextEmpty(text){
    return ($.trim(text) === '')
  }

  get(){
    const contentList = []
    for (var contentId in this.contentMap){
      var content = this.contentMap[contentId].get()
      contentList[content.contentIndex] = content
    }
    return contentList
  }

  set(data){
    console.log("SETTING DATA", this.opts)
    if(Array.isArray(data)){
      for(var i in data){
        const sectionId = data[i].id
        const sectionTitle = data[i].title
        const sectionText = data[i].text
        const sectionCharts = data[i].charts
        this.generateSection(sectionId, sectionTitle, sectionText, sectionCharts)
      }
    }
  }

  </script>
</content>