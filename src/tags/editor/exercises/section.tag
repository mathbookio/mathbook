<exercise-section>
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
     <div class="exercise" id="{ exerciseQuestionId }"></div>
     <div class="exercise" id="{ exerciseAnswerId }"></div>
</div>
<div class="modal {is-active: showModal}">
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Edit Exercise</p>
      <button class="delete" aria-label="close" onclick={ closeModal }></button>
    </header>
    <section class="modal-card-body">
      <div class="field">
        <div class="control">
          <input type="text" id="{ editExerciseQuestionId }" class="input mathContent" placeholder="edit exercise question"/>
       </div>
      </div>
      <div class="field">
        <div class="control">
          <textarea id="{ editExerciseAnswerId }" class="textarea mathContent" placeholder="edit exercise answer"></textarea>
        </div>
        <br/>
        <div class="control">
        <label>Question Preview</label>
          <div class="box">
            <p id='{ editExerciseQuestionTextId }'></p>
          </div>
        </div>
        <div class="control">
        <label>Answer Preview</label>
          <div class="box">
            <p id='{ editExerciseAnswerTextId }'></p>
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
var that = this
console.log(this.opts)
this.showModal = false
this.exerciseAnswerId = 'exerciseAnswer_' + this.opts.id
this.exerciseQuestionId = 'exerciseQuestion_' + this.opts.id

this.editExerciseQuestionId = 'editExerciseQuestion' + '_' + this.opts.id
this.editExerciseQuestionTextId = 'editExerciseQuestionText' + '_' + this.opts.id

this.editExerciseAnswerId = 'editExerciseAnswer' + '_' + this.opts.id
this.editExerciseAnswerTextId = 'editExerciseAnswerText' + '_' + this.opts.id

this.on('mount', function() {
  $('#'+this.exerciseAnswerId).html(this.opts.exerciseAnswer)
  $('#'+this.exerciseQuestionId).html(this.opts.exerciseQuestion)

  $('#'+this.editExerciseQuestionId).on('input', function(e) {
      var osText = $('#'+that.editExerciseQuestionId).val()
      $('#'+that.editExerciseQuestionTextId).html(osText)
      MathJax.Hub.Queue(['Typeset', MathJax.Hub, '#'+that.editExerciseQuestionTextId])
    });
  $('#'+this.editExerciseAnswerId).on('input', function(e) {
      var osText = $('#'+that.editExerciseAnswerId).val()
      $('#'+that.editExerciseAnswerTextId).html(osText)
      MathJax.Hub.Queue(['Typeset', MathJax.Hub, '#'+that.editExerciseAnswerTextId])
    });

})

editSection(){
  this.showModal = true
  $('#'+this.editExerciseQuestionId).val(this.opts.exerciseQuestion)
  $('#'+this.editExerciseQuestionTextId).html(this.opts.exerciseQuestionText)

  $('#'+this.editExerciseAnswerId).val(this.opts.exerciseAnswer)
  $('#'+this.editExerciseAnswerTextId).html(this.opts.exerciseAnswerText)
}

saveChanges(){
  var confirmChanges = confirm('Would you like to confirm these changes ?')
  if (confirmChanges){
    this.opts.exerciseQuestion = $('#'+this.editExerciseQuestionId).val()
    this.opts.exerciseQuestionText = $('#'+this.editExerciseQuestionTextId).html()

    this.opts.exerciseAnswer = $('#'+this.editExerciseAnswerId).val()
    this.opts.exerciseAnswerText = $('#'+this.editExerciseAnswerTextId).html()
    $('#'+this.exerciseQuestionId).html(this.opts.exerciseQuestionText)
    $('#'+this.exerciseAnswerId).html(this.opts.exerciseAnswerText)
    this.closeModal()
  }
}

closeModal(){
  this.showModal = false
}

removeSection(){
  var confirmChanges = confirm('Are you sure you want to delete the chosen exercise ?')
  if (confirmChanges){
    this.unmount(true)
    $('#'+this.opts.id).remove()
  }
}
</script>
</exercise-section>