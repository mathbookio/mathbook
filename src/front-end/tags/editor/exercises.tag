<exercises id="exercisesComponent">
  <style>
    #exerciseAnswerText{
      white-space: pre-wrap;
    }
  </style>
  <section class="section">
    <div id="exerciseContainer" class="container">
      <h5 class="title">Exercises</h5>
      <h6 class="subtitle">Create a minimum of 3 exercises that range in difficulty</h6>
    <div class="field">
      <div class="control">
        <a class="button" onclick={ showChartModal }>Insert Chart</a>
      </div>
  </div>
<div class="field">
    <div class="control">
      <input type="text" id="exerciseQuestion" class="input mathContent {is-danger: isQuestionInvalid}" placeholder="question"/>
      <p show={ isQuestionInvalid } class="help is-danger">Question can't be empty</p>
    </div>
  </div>
  <div class="field">
    <div class="control">
      <textarea id="exerciseAnswer" class="textarea mathContent {is-danger: isAnswerInvalid}" placeholder="the answer..."></textarea>
      <p show={ isAnswerInvalid } class="help is-danger">Answer can't be empty</p>
    </div>
    <br/>
    <div class="control">
    <label>Question Preview</label>
      <div class="box">
        <p id='exerciseQuestionText' class="previewText"></p>
      </div>
    </div>
    <div class="control">
    <label>Answer Preview</label>
      <div class="box">
        <p id='exerciseAnswerText' class="previewText"></p>
      </div>
    </div>
  </div>
  <div class="control">
    <a class="button is-info" onclick={ saveSection }>Add Exercise</a>
  </div>
  <br/>
    <div id="exerciseList">
    </div>
    </div>
  </section>
<script>

  var self = this
  this.exerciseMap = {}
  this.chartList = []
  this.clientId = 'exercises'
  this.isQuestionInvalid = false
  this.isAnswerInvalid = false
  this.tabObservable = this.opts.observable
  this.chartObservable = this.opts.chartObservable
  this.exerciseObservable = riot.observable()

  this.on('mount', function() {
    self.initSortable()

    this.tabObservable.on('show', function(type){
      if (type === 'exercises'){
        $('#exercisesComponent').show()
        self.exerciseObservable.trigger('renderCharts')
        self.renderQuestionPreview()
        self.renderAnswerPreview()
      }
      else{
        $('#exercisesComponent').hide()
      }
    })

    this.exerciseObservable.on('createdExercise', function(exerciseId, exerciseObj) {
      self.exerciseMap[exerciseId] = exerciseObj
    })
   
    this.exerciseObservable.on('deletedExercise', function(exerciseId) {
      delete self.exerciseMap[exerciseId]
    })

    $('#exerciseQuestion').on('input', debounce(self.renderQuestionPreview));
    $('#exerciseAnswer').on('input', debounce(self.renderAnswerPreview));

    this.chartObservable.on('savedChart', function(clientId, chartSize, chartData, chartOptions) {
      if (clientId !== self.clientId){
        return
      }
      const newChartId = uniqueId()
      
      const currentContentSection = $('#exerciseQuestion').val()
      const appendDiv = '<div id="'+newChartId+'" class="ct-chart '+chartSize+'"></div>'
      $('#exerciseQuestion').val(currentContentSection + ' ' + appendDiv)
      self.chartList.push({ id: newChartId, data: chartData, options: chartOptions })
      $('#exerciseQuestion').trigger('input')
    })

  })

  renderQuestionPreview(){
    const questionVal = $('#exerciseQuestion').val()
    $('#exerciseQuestionText').html(questionVal)
    renderMathInElement(document.getElementById('exerciseQuestionText'))
    self.renderExerciseCharts(self.chartList)
  }

  renderAnswerPreview(){
    var answerVal = $('#exerciseAnswer').val()
    $('#exerciseAnswerText').html(answerVal)
    renderMathInElement(document.getElementById('exerciseAnswerText'))
    self.renderExerciseCharts(self.chartList)
  }

  initSortable(){
    var exerciseList = document.getElementById('exerciseList')
    Sortable.create(exerciseList, { 
      handle: '.moveHandle',
      onUpdate: function(e){
        self.exerciseObservable.trigger('exerciseOrderUpdate', e.oldIndex, e.newIndex)

      } });
  }

  saveSection(){
    var exerciseNumber = uniqueId()
    var exerciseId = 'exerciseBox_'+exerciseNumber

    var question = $('#exerciseQuestion').val()
    var questionText = $('#exerciseQuestionText').html()

    var answer = $('#exerciseAnswer').val()
    var answerText = $('#exerciseAnswerText').html()

    this.isQuestionInvalid = this.isTextInvalid(questionText)
    this.isAnswerInvalid = this.isTextInvalid(answerText)
    if(this.isQuestionInvalid || this.isAnswerInvalid){
      return
    }
    this.generateExercise(exerciseId, question, questionText, answer, answerText, this.chartList)
    this.cleanupFields()
  }

  generateExercise(exerciseId, question, questionText, answer, answerText, chartList){
    const exerciseIndex = $('exercise-section').length
    $('#exerciseList').append('<exercise-section id="'+exerciseId+'"></exercise-section>')
    riot.mount('#'+exerciseId, 
    { exerciseObservable: this.exerciseObservable,
      chartObservable: this.chartObservable,
      exerciseIndex: exerciseIndex,
      question: question, 
      answer: answer,
      chartList: chartList })
  }

  isTextInvalid(text){
    return ($.trim(text) === '')
  }

  cleanupFields(){
    $('#exerciseQuestion').val('')
    $('#exerciseQuestionText').html('')
    $('#exerciseAnswer').val('')
    $('#exerciseAnswerText').html('')
    this.chartList = []
  }

  showChartModal(){
    this.chartObservable.trigger('showChartModal', self.clientId)
  }

  renderExerciseCharts(chartList) {
    for (var i in chartList) {
      const chart = chartList[i]
      const questionSelector = $('#exerciseQuestionText > #'+chart.id).get(0)
      if (questionSelector){
        createLineChart(questionSelector, chart.data, chart.options)
      }
      const answerSelector = $('#exerciseAnswerText > #'+chart.id).get(0)
      if (answerSelector){
        createLineChart(answerSelector, chart.data, chart.options)
      }
    }
  }

  get(){
    const exerciseList = []
    for (var exerciseId in this.exerciseMap){
      var exercise = this.exerciseMap[exerciseId].get()
      exerciseList[exercise.exerciseIndex] = exercise
    }
    return exerciseList
  }

  getWorkInProgress(){
    return {
      question: $('#exerciseQuestion').val(),
      answer: $('#exerciseAnswer').val(),
      chartList: this.chartList
    }
  }

  set(data){
    if(Array.isArray){
      for(var i in data){
        const exerciseId = data[i].id
        const question = data[i].question
        const questionText = data[i].questionText
        const answer = data[i].answer
        const answerText = data[i].answerText
        const chartList = data[i].chartList
        this.generateExercise(exerciseId, question, questionText, answer, answerText, chartList)
      }
    }
  }

  setWorkInProgress(data = {}){
    console.log('exercise work in progress', data)
    $('#exerciseQuestion').val(data.question || '')
    $('#exerciseAnswer').val(data.answer || '')
    this.chartList = data.chartList || []
  }

  </script>
</exercises>