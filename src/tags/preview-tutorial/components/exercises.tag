<tutorial-exercises>
<section class="section my-section-margin">
    <div id="exercises" class="title is-4">Exercises</div>
    <div class="content">
      <p>{ exerciseStatement }</p>
      <div class="content" each={ exercises }>
        <p> 
          { exerciseIndex + 1 } \(\quad\) \({questionText}\) \(\quad\)
        </p>
        <button class="button is-white" onclick={ showExerciseAnswer }>Show Answer</button>
        <p show={ showAnswer }>
        { answerText }
        </p>
      </div>
    </div>
  </section>
<script>
var that = this
this.exerciseStatement = this.opts.exerciseStatment || ''
this.exercises = this.opts.exercises || []

showExerciseAnswer(e){
  e.item.showAnswer = !e.item.showAnswer
}

set(data){
  this.exerciseStatement = data['exerciseStatement']
  this.exercises = data['exercises']
}
</script>
</tutorial-exercises>