<exercise-section>
<div class="box">
<div class="level">
     <div class="level-right">
      <span class="level-item" >
      <span class="icon is-small moveHandle"><i class="fa fa-bars" aria-hidden="true"></i></span>
      </span>
      <a class="level-item" onclick={ editExercise }>
      <span class="icon is-small has-text-info"><i class="fa fa-pencil" aria-hidden="true"></i></span>
      </a>
      <a class="level-item" onclick={ removeExercise }>
      <span class="icon is-small has-text-danger"><i class="fa fa-close" aria-hidden="true"></i></span>
      </a>
      </div>
     </div>
     <div class="exercise"><p id="{ questionId }" class="previewText"></p></div>
     <br/>
     <div class="exercise"><p id="{ answerId }" class="previewText"></p></div>
</div>
<!--  MODAL TO EDIT EXERCISE  -->
<div class="modal {is-active: showModal}">
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Edit Exercise</p>
      <button class="delete" aria-label="close" onclick={ close }></button>
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
            <p id='{ editQuestionTextId }' class="previewText"></p>
          </div>
        </div>
        <div class="control">
        <label>Answer Preview</label>
          <div class="box">
            <p id='{ editAnswerTextId }' class="previewText"></p>
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
  this.opts.exerciseObservable.trigger('createdExercise', this.opts.id, this)
  that.bindExerciseValues()
  // preview question text
  that.$('editQuestionId').on('input', function(e) {
      var questionVal = that.$('editQuestionId').val()
      that.$('editQuestionTextId').html(questionVal)
      that.render(that.editQuestionTextId)
    });

  // preview answer text
  that.$('editAnswerId').on('input', function(e) {
      var answerVal = that.$('editAnswerId').val()
      that.$('editAnswerTextId').html(answerVal)
      that.render(that.editAnswerTextId)
    });

  that.opts.exerciseObservable.on('deletedExercise', function(exerciseId, exerciseIndex) {
    console.log('exercise obeservable deletedExercise triggered', { exerciseId: exerciseId, exerciseIndex: exerciseIndex })
      if(exerciseIndex < that.opts.exerciseIndex){
       console.log('an exercise was deleted before', that.opts.question, that.opts.exerciseIndex)
       that.opts.exerciseIndex -= 1
       console.log('an exercise was deleted after', that.opts.question, that.opts.exerciseIndex)

      }
  })

  that.opts.exerciseObservable.on('exerciseOrderUpdate', function(oldIndex, newIndex){
    console.log('exerciseOrderUpdate triggered', { oldIndex: oldIndex, newIndex: newIndex })
    if (oldIndex === that.opts.exerciseIndex){
      console.log('oldIndex === exerciseIndex')
      that.opts.exerciseIndex = newIndex
      console.log('after oldIndex === exerciseIndex',that.opts.question, that.opts.exerciseIndex)
      return
    }

    // an exercise was moved up the list
    if (oldIndex > newIndex && newIndex <= that.opts.exerciseIndex && oldIndex > that.opts.exerciseIndex){
      console.log('an exercise was moved up the list before', that.opts.question, that.opts.exerciseIndex)
      that.opts.exerciseIndex += 1
      console.log('an exercise was moved up the list after', that.opts.question, that.opts.exerciseIndex)
    }
    // an exercise was moved down the list
    else if (oldIndex < newIndex && newIndex >= that.opts.exerciseIndex && oldIndex < that.opts.exerciseIndex){
      console.log('an exercise was moved down the list before', that.opts.question, that.opts.exerciseIndex)
      that.opts.exerciseIndex -= 1
      console.log('an exercise was moved down the list after', that.opts.question, that.opts.exerciseIndex)
    } 
    else{
      console.log('nothing happened for', that.opts.question, that.opts.exerciseIndex)
    }


  })
  
})

bindExerciseValues(){
  this.$('questionId').html(this.opts.question)
  this.$('answerId').html(this.opts.answer)
  that.render(that.questionId)
  that.render(that.answerId)
}

editExercise(){
  this.showModal = true
  // when the modal opens, we want the question and answer values to carry over
  this.$('editQuestionId').val(this.opts.question)
  this.$('editQuestionTextId').html(this.opts.question)
  that.render(this.editQuestionTextId)

  this.$('editAnswerId').val(this.opts.answer)
  this.$('editAnswerTextId').html(this.opts.answer)
  that.render(this.editAnswerTextId)
}

saveChanges(){
  var confirmChanges = confirm('Would you like to confirm these changes ?')
  if (confirmChanges){
    this.updateExercise()
    const showPrompt = false
    this.closeModal(showPrompt)
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

removeExercise(){
  var confirmChanges = confirm('Are you sure you want to delete the chosen exercise ?')
  if (confirmChanges){
    this.opts.exerciseObservable.trigger('deletedExercise', this.opts.id, this.opts.exerciseIndex)
    this.unmount(true)
    $(this.opts.id).remove()
  }
}

get(){
  return {
    id: this.opts.id,
    question: this.opts.question,
    answer: this.opts.answer,
    exerciseIndex: this.opts.exerciseIndex
  }
}

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
</exercise-section>