<exercise-section>
<div class="box">
<div class="level">
     <div class="level-right">
     <span class="level-item moveHandle" >
     <span class="icon is-small"><i class="fa fa-bars" aria-hidden="true"></i></span>
     </span>
     <a class="level-item" onclick={ editExercise }>
     <span class="icon is-small has-text-info"><i class="fa fa-pencil" aria-hidden="true"></i></span>
     </a>
     <a class="level-item" onclick={ removeExercise }>
     <span class="icon is-small has-text-danger"><i class="fa fa-close" aria-hidden="true"></i></span>
     </a>
     </div></div>
     <div class="exercise" id="{ questionId }"></div>
     <div class="exercise" id="{ answerId }"></div>
</div>
<!--  MODAL TO EDIT EXERCISE  -->
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
          <input type="text" id="{ editQuestionId }" class="input mathContent" placeholder="edit exercise question"/>
       </div>
      </div>
      <div class="field">
        <div class="control">
          <textarea id="{ editAnswerId }" class="textarea mathContent" placeholder="edit exercise answer"></textarea>
        </div>
        <br/>
        <div class="control">
        <label>Question Preview</label>
          <div class="box">
            <p id='{ editQuestionTextId }'></p>
          </div>
        </div>
        <div class="control">
        <label>Answer Preview</label>
          <div class="box">
            <p id='{ editAnswerTextId }'></p>
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

// generate Id's
this.answerId = 'answer_' + this.opts.id
this.questionId = 'question_' + this.opts.id

this.editQuestionId = 'editQuestion_' + this.opts.id
this.editQuestionTextId = 'editQuestionText_' + this.opts.id

this.editAnswerId = 'editAnswer_' + this.opts.id
this.editAnswerTextId = 'editAnswerText_' + this.opts.id

this.on('mount', function() {
  that.bindExerciseValues()

  // preview question text
  that.$('editQuestionId').on('input', function(e) {
      var questionVal = that.$('editQuestionId').val()
      that.$('editQuestionTextId').html(questionVal)
      MathJax.Hub.Queue(['Typeset', MathJax.Hub, '#'+that.editQuestionTextId])
    });

  // preview answer text
  that.$('editAnswerId').on('input', function(e) {
      var answerVal = that.$('editAnswerId').val()
      that.$('editAnswerTextId').html(answerVal)
      MathJax.Hub.Queue(['Typeset', MathJax.Hub, '#'+that.editAnswerTextId])
    });
})

bindExerciseValues(){
  this.$('questionId').html(this.opts.question)
  this.$('answerId').html(this.opts.answer)
}

editExercise(){
  this.showModal = true
  // when the modal opens, we want the question and answer values to carry over
  this.$('editQuestionId').val(this.opts.question)
  this.$('editQuestionTextId').html(this.opts.questionText)

  this.$('editAnswerId').val(this.opts.answer)
  this.$('editAnswerTextId').html(this.opts.answerText)
}

saveChanges(){
  var confirmChanges = confirm('Would you like to confirm these changes ?')
  if (confirmChanges){
    this.updateExercise()
    this.closeModal()
  }
}

updateExercise(){
    this.opts.question = this.$('editQuestionId').val()
    this.opts.questionText = this.$('editQuestionTextId').html()

    this.opts.answer = this.$('editAnswerId').val()
    this.opts.answerText = this.$('editAnswerTextId').html()

    this.$('questionId').html(this.opts.questionText)
    this.$('answerId').html(this.opts.answerText)
}

closeModal(){
  this.showModal = false
}

removeExercise(){
  var confirmChanges = confirm('Are you sure you want to delete the chosen exercise ?')
  if (confirmChanges){
    this.unmount(true)
    $(this.opts.id).remove()
  }
}

// jquery alias
$(val){
  return $('#'+this[val])
}
</script>
</exercise-section>