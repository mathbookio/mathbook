<content-section>
<div class="box">
<div class="level">
     <div class="level-right">
      <span class="level-item moveHandle" >
        <span class="icon is-small"><i class="fas fa-bars" aria-hidden="true"></i></span>
     </span>
     <a class="level-item" onclick={ editSection }>
     <span class="icon is-small has-text-info"><i class="fas fa-pencil-alt" aria-hidden="true"></i></span>
     </a>
     <a class="level-item" onclick={ removeSection }>
     <span class="icon is-small has-text-danger"><i class="fas fa-trash-alt" aria-hidden="true"></i></span>
     </a>
     </div></div>
     <div class="title is-4">{ sectionTitle }</div>
     <div class="content"><p id="{ sectionId }" class="previewText"></p></div>
</div>
<div class="modal {is-active: showModal}">
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Edit Section</p>
      <button class="delete" aria-label="close" onclick={ close }></button>
    </header>
    <section class="modal-card-body">
      <div class="field">
        <div class="control">
          <input type="text" id="{ editTitleId }" class="input mathContent" placeholder="Section Title ie) Understanding Factoring"/>
       </div>
      </div>
      <div class="field">
        <div class="control">
          <a class="button" onclick={ showChartModal }>Insert Chart</a>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <textarea id="{ editSectionId }" class="textarea mathContent" placeholder="Edit section content"></textarea>
        </div>
        <br/>
        <div class="control">
        <label>Preview</label>
          <div class="box">
            <p id="{ editSectionTextId }" class="previewText"></p>
          </div>
        </div>
      </div>
    </section>
    <footer class="modal-card-foot">
      <button class="button is-success" onclick={ saveChanges }>Save changes</button>
      <button class="button" onclick={ close }>Cancel</button>
      <p class="help has-text-grey">Remember to Save Tutorial State after you save your changes.</p>
    </footer>
  </div>
</div>
<script>
var self = this

this.showModal = false
this.clientId = this.opts.id
this.sectionId = 'content_' + this.opts.id
this.sectionTitle = this.opts.sectionTitle
this.sectionText = this.opts.sectionText
this.sectionCharts = this.opts.sectionCharts
this.chartObservable =  this.opts.chartObservable

//generate Id's
this.editTitleId =  'editContentTitle_' + this.opts.id
this.editSectionId = 'editContentSection_' + this.opts.id
this.editSectionTextId = 'editContentSectionText_' + this.opts.id


this.on('mount', function() {

  this.opts.contentObservable.trigger('createdContentSection', this.opts.id, this)
  // bind section content
  this.$('sectionId').html(this.sectionText)
  this.render(this.sectionId)
  this.renderCharts(this.sectionCharts)
  
  // preview section content edits/changes in modal view
  this.$('editSectionId').on('input', debounce(self.renderContentPreview));

    self.opts.contentObservable.on('renderCharts', function() {
      self.renderCharts(self.sectionCharts)
    })

    self.opts.contentObservable.on('deletedContentSection', function(contentId, contentIndex) {
      if(contentIndex < self.opts.contentIndex){
       self.opts.contentIndex -= 1
      }
  })

  self.opts.contentObservable.on('contentOrderUpdate', function(oldIndex, newIndex){
    if (oldIndex === self.opts.contentIndex){
      self.opts.contentIndex = newIndex
      return
    }

    // an content was moved up the list
    if (oldIndex > newIndex && newIndex <= self.opts.contentIndex && oldIndex > self.opts.contentIndex){
      self.opts.contentIndex += 1
    }
    // an content was moved down the list
    else if (oldIndex < newIndex && newIndex >= self.opts.contentIndex && oldIndex < self.opts.contentIndex){
      self.opts.contentIndex -= 1
    }
    
  })

  this.chartObservable.on('savedChart', function(clientId, chartSize, chartData, chartOptions) {

    if (clientId !== self.clientId){
      return
    }

    const newChartId = uniqueId()
    
    const currentContentSection = self.$('editSectionId').val()
    const appendDiv = '<div id="'+newChartId+'" class="ct-chart '+chartSize+'"></div>'
    self.$('editSectionId').val(currentContentSection + ' ' + appendDiv)
    self.sectionCharts.push({ id: newChartId, data: chartData, options: chartOptions })
    self.$('editSectionId').trigger('input')
  })

})

renderContentPreview(){
  const contentVal = self.$('editSectionId').val()
  self.$('editSectionTextId').html(contentVal)
  self.render(self.editSectionTextId)
  self.renderEditModalCharts(self.sectionCharts)
}

editSection(){
  this.showModal = true
  // when the modal opens, we want the section title and content values to carry over
  this.$('editTitleId').val(this.sectionTitle)
  this.$('editSectionId').val(this.sectionText)
  this.$('editSectionTextId').html(this.sectionText)
  this.render(this.editSectionTextId)
  this.renderEditModalCharts(this.sectionCharts)
}

saveChanges(){
  var confirmChanges = confirm('Would you like to confirm these changes ?')
  if (confirmChanges){
    this.updateContent()
    const showPrompt = false
    Messenger.send(MessageTopic.TutorialUpdate)
    this.closeModal(false)
  }
}

updateContent(){
  this.sectionTitle = this.$('editTitleId').val()
  this.sectionText = this.$('editSectionId').val()
  this.$('sectionId').html(this.sectionText)
  this.render(this.sectionId)
  this.renderCharts(this.sectionCharts)
}

close(){
  const showPrompt = true
  this.closeModal(showPrompt)
}

closeModal(showPrompt){
  if (showPrompt){
    var confirmClose = confirm('Are you sure you want to close this edit view ? Any unsaved changes will be discarded.')
    if (confirmClose){
      this.showModal = false
    }
  }
  else{
    this.showModal = false
  }
}

removeSection(){
  var confirmChanges = confirm('Are you sure you want to delete the chosen section ?')
  if (confirmChanges){
    this.opts.contentObservable.trigger('deletedContentSection', this.opts.id, this.opts.contentIndex)
    Messenger.send(MessageTopic.TutorialUpdate)
    this.unmount(true)
    $('#'+this.opts.id).remove()
  }
}

get(){
  return {
    id: this.opts.id,
    contentIndex: this.opts.contentIndex,
    title: this.sectionTitle,
    text: this.sectionText,
    charts: this.sectionCharts
  }
}

// renderMathInElement alias
render(id){
  try{
    renderMathInElement(document.getElementById(id))
  }
  catch(err){
    console.error('section::render::err',err)
  }
}

  showChartModal(){
    this.chartObservable.trigger('showChartModal', self.clientId)
  }

renderCharts(chartList) {
  for (var i in chartList) {
    const chart = chartList[i]
    const selector = $('#'+this.sectionId+'> #'+chart.id).get(0)
    createLineChart(selector, chart.data, chart.options)
  }
}

renderEditModalCharts(chartList) {
  for (var i in chartList) {
    const chart = chartList[i]
    const selector = $('#'+this.editSectionTextId+'> #'+chart.id).get(0)
    createLineChart(selector, chart.data, chart.options)
  }
}

// jquery alias
$(val){
  return $('#'+this[val])
}
</script>
</content-section>