<content-section>
<div class="box">
<div class="level">
     <div class="level-right">
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
          <input type="text" id="editContentTitle" class="input" placeholder="Section Title ie) Understanding Factoring"/>
       </div>
      </div>
      <div class="field">
        <div class="control">
          <textarea id="editContentSection" class="textarea" placeholder="Edit section content"></textarea>
        </div>
        <br/>
        <div class="control">
        <label>Preview</label>
          <div class="box">
            <p id='editContentSectionText'></p>
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
this.showModal = false
this.sectionId = 'content_' + this.opts.id
this.sectionTitle = this.opts.sectionTitle

this.on('mount', function() {
  $('#'+this.sectionId).html(this.opts.sectionContent)

  $('#editContentSection').on('input', function(e) {
      var osText = $('#editContentSection').val()
      console.log('editOsText', osText)
      $('#editContentSectionText').html(osText)
      MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'editContentSectionText'])
    });

})

editSection(){
  this.showModal = true
  $('#editContentTitle').val(this.sectionTitle)
  $('#editContentSection').val(this.opts.sectionText)
  $('#editContentSectionText').html(this.opts.sectionContent)
}

saveChanges(){
  var confirmChanges = confirm('Would you like to confirm these changes ?')
  if (confirmChanges){
    this.sectionTitle = $('#editContentTitle').val()
    this.opts.sectionText = $('#editContentSection').val()
    this.opts.sectionContent = $('#editContentSectionText').html()
    $('#'+this.sectionId).html(this.opts.sectionContent)
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