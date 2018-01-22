<tutorial-exercises>
  <style>
    .preWrap{
      white-space: pre-wrap;
    }
  </style>
<section class="section my-section-margin">
<div class="container is-fluid">
    <div id="exercises" class="title is-4">Exercises</div>
    <div class="content serif">
      <p>{ exerciseStatement }</p>
      <div class="content is-exercise" each={ exercises }>
        <p id={"q_"+exerciseIndex} class="preWrap"> 
          <span class="serif">{ exerciseIndex + 1 })</span> \(\quad\) <span id={'q_text_'+exerciseIndex}></span> \(\quad\)
        </p>
        <button class="button is-white" onclick={ showExerciseAnswer }>Show Answer</button>
        <div class="columns">
          <div class="column is-one-third">
          </div>
          <div class="column is-one-third">
            <p id={"a_"+exerciseIndex} class="preWrap">{ answer }</p>
          </div>
          <div class="column is-one-third">
          </div>
        </div>
      </div>
    </div>
    </div>
  </section>
<script>
var self = this
this.exerciseStatement = this.opts.exerciseStatment || ''
this.exercises = this.opts.exercises || []
this.renderedCharts = {} // used to keep track of charts that have been rendered

this.one('updated', function() {

  self.renderExercises()
})

showExerciseAnswer(e){
  const answerId = "#a_"+e.item.exerciseIndex
  $(answerId).toggle()
  this.rerenderAnswerCharts(answerId)
}

rerenderAnswerCharts(answerId){
  const answerCharts = $(answerId+'> .ct-chart')
  for(var aChart of answerCharts){
    const chartId = aChart['id']
    const chart = this.renderedCharts[chartId]
    updateLineChart(chart)
  }
}

renderExercises(){
  for(var exe of this.exercises){
    const index = exe.exerciseIndex

    const questionId = 'q_' + index
    const questionTextId = 'q_text_' + index

    const answerId = 'a_' + index
    const answerTextId = 'a_text_' + index

    $('#'+questionTextId).html(exe.question)
    $('#'+answerId).html(exe.answer)

    try{
      renderMath(questionId)
      renderMath(answerId)
      this.renderedCharts = $.extend(this.renderedCharts, renderCharts(exe.chartList))
      $('#'+answerId).toggle()
    }
    catch(err){
      console.log('error set:exercise component', err)
    }

  }
}

set(data){
  this.exerciseStatement = data['exerciseStatement']
  this.exercises = data['exercises']
}

</script>
</tutorial-exercises>