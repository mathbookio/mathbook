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
     <div class="content" id="{ sectionId }"></div>
</div>
<div class="modal {is-active: showModal}">
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Edit Section</p>
      <button class="delete" aria-label="close" onclick={ closeModal }></button>
    </header>
    <section class="modal-card-body">
      <div class="field">
        <div class="control">
          <input type="text" id="{ editContentTitleId }" class="input mathContent" placeholder="Section Title ie) Understanding Factoring"/>
       </div>
      </div>
      <div class="field">
        <div class="control">
          <textarea id="{ editContentSectionId }" class="textarea mathContent" placeholder="Edit section content"></textarea>
        </div>
        <br/>
        <div class="control">
        <label>Preview</label>
          <div class="box">
            <p id="{ editContentSectionTextId }"></p>
          </div>
        </div>
      </div>
    </section>
    <footer class="modal-card-foot">
      <button class="button is-success" onclick={ saveChanges }>Save changes</button>
      <button class="button" onclick={ closeModal }>Cancel</button>
    </footer>
  </div>
</div>
<script>
console.log(this.opts)
var that = this
this.showModal = false
this.sectionId = 'content_' + this.opts.id
this.sectionTitle = this.opts.sectionTitle
this.sectionContent = this.opts.sectionContent
this.sectionText = this.opts.sectionText

this.editContentTitleId =  'editContentTitle' + '_' + this.opts.id
this.editContentSectionId = 'editContentSection' + '_' + this.opts.id
this.editContentSectionTextId = 'editContentSectionText' + '_' + this.opts.id


this.on('mount', function() {
  $('#'+this.sectionId).html(this.sectionContent)

  $('#'+this.editContentSectionId).on('input', function(e) {
      var osText = $('#'+that.editContentSectionId).val()
      console.log('$(#this.editContentSectionId).val()', $('#'+that.editContentSectionId))
      console.log('EDIT CONTENT SECTION TEXT', osText)
      $('#'+that.editContentSectionTextId).html(osText)
      MathJax.Hub.Queue(['Typeset', MathJax.Hub, that.editContentSectionTextId])
    });

})

editSection(){
  this.showModal = true
  $('#'+this.editContentTitleId).val(this.sectionTitle)
  $('#'+this.editContentSectionId).val(this.sectionText)
  $('#'+this.editContentSectionTextId).html(this.sectionContent)
}

saveChanges(){
  var confirmChanges = confirm('Would you like to confirm these changes ?')
  if (confirmChanges){
    this.sectionTitle = $('#'+this.editContentTitleId).val()
    this.sectionText = $('#'+this.editContentSectionId).val()
    this.sectionContent = $('#'+this.editContentSectionTextId).html()
    $('#'+this.sectionId).html(this.sectionContent)
    this.closeModal()
  }
}

closeModal(){
  this.showModal = false
}

removeSection(){
  var confirmChanges = confirm('Are you sure you want to delete the chosen section ?')
  if (confirmChanges){
    this.unmount(true)
    $('#'+this.opts.id).remove()
  }
}
</script>
</content-section>