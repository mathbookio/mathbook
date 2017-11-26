<tutorial-exercises>
  <style>
    .preWrap{
      white-space: pre-wrap;
    }
  </style>
<section class="section my-section-margin">
    <div id="exercises" class="title is-4">Exercises</div>
    <div class="content">
      <p>{ exerciseStatement }</p>
      <div class="content is-exercise" each={ exercises }>
        <p id={"q_"+exerciseIndex} class="preWrap"> 
          <span class="serif">{ exerciseIndex + 1 })</span> \(\quad\) {question} \(\quad\)
        </p>
        <button class="button is-white" onclick={ showExerciseAnswer }>Show Answer</button>
        <div class="columns">
          <div class="column is-one-third">
          </div>
          <div class="column is-one-third">
            <p show={ showAnswer } id={"a_"+exerciseIndex} class="preWrap">{ answer }</p>
          </div>
          <div class="column is-one-third">
          </div>
        </div>
      </div>
    </div>
  </section>
<script>
var that = this
this.exerciseStatement = this.opts.exerciseStatment || ''
this.exercises = this.opts.exercises || []

showExerciseAnswer(e){
  const answerId = "#a_"+e.item.exerciseIndex
  $(answerId).toggle()
}

set(data){
  this.exerciseStatement = data['exerciseStatement']
  this.exercises = data['exercises']
  for(var exe of this.exercises){
    const index = exe.exerciseIndex
    const questionId = '#q_' + index
    const answerId = '#a_' + index
    try{
      renderMathInElement(document.getElementById(questionId))
      renderMathInElement(document.getElementById(answerId))
      $(answerId).toggle()
    }
    catch(err){

    }

  }
  
}

</script>
</tutorial-exercises>