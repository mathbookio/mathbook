<content-section>
<div class="box">
<div class="level">
     <div class="level-right">
      <span class="level-item moveHandle" >
        <span class="icon is-small"><i class="fa fa-bars" aria-hidden="true"></i></span>
     </span>
     <a class="level-item" onclick={ editSection }>
     <span class="icon is-small has-text-info"><i class="fa fa-pencil" aria-hidden="true"></i></span>
     </a>
     <a class="level-item" onclick={ removeSection }>
     <span class="icon is-small has-text-danger"><i class="fa fa-close" aria-hidden="true"></i></span>
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
    </footer>
  </div>
</div>
<script>
console.log(this.opts)
var that = this
this.showModal = false
this.sectionId = 'content_' + this.opts.id
this.sectionTitle = this.opts.sectionTitle
this.sectionText = this.opts.sectionText

//generate Id's
this.editTitleId =  'editContentTitle_' + this.opts.id
this.editSectionId = 'editContentSection_' + this.opts.id
this.editSectionTextId = 'editContentSectionText_' + this.opts.id


this.on('mount', function() {

  this.opts.contentObservable.trigger('createdContentSection', this.opts.id, this)
  // bind section content
  this.$('sectionId').html(this.sectionText)
  this.render(this.sectionId)
  
  // preview section content edits/changes in modal view
  this.$('editSectionId').on('input', function(e) {
      var contentVal = that.$('editSectionId').val()
      that.$('editSectionTextId').html(contentVal)
       that.render(that.editSectionTextId)
    });

    that.opts.contentObservable.on('deletedContentSection', function(contentId, contentIndex) {
    console.log('content obeservable deletedContentSection triggered', { contentId: contentId, contentIndex: contentIndex })
      if(contentIndex < that.opts.contentIndex){
       console.log('an content was deleted before', that.sectionTitle, that.opts.contentIndex)
       that.opts.contentIndex -= 1
       console.log('an content was deleted after', that.sectionTitle, that.opts.contentIndex)

      }
  })

  that.opts.contentObservable.on('contentOrderUpdate', function(oldIndex, newIndex){
    console.log('contentOrderUpdate triggered', { oldIndex: oldIndex, newIndex: newIndex })
    if (oldIndex === that.opts.contentIndex){
      console.log('oldIndex === contentIndex')
      that.opts.contentIndex = newIndex
      console.log('after oldIndex === contentIndex',that.sectionTitle, that.opts.contentIndex)
      return
    }

    // an content was moved up the list
    if (oldIndex > newIndex && newIndex <= that.opts.contentIndex && oldIndex > that.opts.contentIndex){
      console.log('an content was moved up the list before', that.sectionTitle, that.opts.contentIndex)
      that.opts.contentIndex += 1
      console.log('an content was moved up the list after', that.sectionTitle, that.opts.contentIndex)
    }
    // an content was moved down the list
    else if (oldIndex < newIndex && newIndex >= that.opts.contentIndex && oldIndex < that.opts.contentIndex){
      console.log('an content was moved down the list before', that.sectionTitle, that.opts.contentIndex)
      that.opts.contentIndex -= 1
      console.log('an content was moved down the list after', that.sectionTitle, that.opts.contentIndex)
    } 
    else{
      console.log('nothing happened for', that.sectionTitle, that.opts.contentIndex)
    }
  })
})

editSection(){
  this.showModal = true
  // when the modal opens, we want the section title and content values to carry over
  this.$('editTitleId').val(this.sectionTitle)
  this.$('editSectionId').val(this.sectionText)
  this.$('editSectionTextId').html(this.sectionText)
  this.render(this.editSectionTextId)
}

saveChanges(){
  var confirmChanges = confirm('Would you like to confirm these changes ?')
  if (confirmChanges){
    this.updateContent()
    const showPrompt = false
    this.closeModal(false)
  }
}

updateContent(){
  this.sectionTitle = this.$('editTitleId').val()
  this.sectionText = this.$('editSectionId').val()
  this.$('sectionId').html(this.sectionText)
  this.render(this.sectionId)
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
    this.unmount(true)
    $('#'+this.opts.id).remove()
  }
}

get(){
  return {
    id: this.opts.id,
    contentIndex: this.opts.contentIndex,
    title: this.sectionTitle,
    text: this.sectionText 
  }
}

// renderMathInElement alias
render(id){
  try{
    renderMathInElement(document.getElementById(id))
  }
  catch(err){
  }
}

// jquery alias
$(val){
  return $('#'+this[val])
}
</script>
</content-section>