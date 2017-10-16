<exercises>
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
        <p id='exerciseQuestionText'></p>
      </div>
    </div>
    <div class="control">
    <label>Answer Preview</label>
      <div class="box">
        <p id='exerciseAnswerText'></p>
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
    var that = this
    this.exerciseMap = {}
    this.isQuestionInvalid = false
    this.isAnswerInvalid = false
    this.exerciseObservable = riot.observable()

  this.on('mount', function() {
    that.initSortable()

    this.exerciseObservable.on('createdExercise', function(exerciseId, exerciseObj) {
      that.exerciseMap[exerciseId] = exerciseObj
    })
    
    this.exerciseObservable.on('deletedExercise', function(exerciseId) {
      delete that.exerciseMap[exerciseId]
    })

    $('#exerciseQuestion').on('input', function(e) {
      var questionVal = $('#exerciseQuestion').val()
      $('#exerciseQuestionText').html(questionVal)
      MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'exerciseQuestionText'])
    });
    $('#exerciseAnswer').on('input', function(e) {
      var answerVal = $('#exerciseAnswer').val()
      $('#exerciseAnswerText').html(answerVal)
      MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'exerciseAnswerText'])
    });
  })

  initSortable(){
    var exerciseList = document.getElementById('exerciseList')
    Sortable.create(exerciseList, { handle: '.moveHandle' });
  }

  saveSection(){
    var exerciseNumber = this.uniqueId()
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
    $('#exerciseList').append('<exercise-section id="'+exerciseId+'"></exercise-section>')
    riot.mount('#'+exerciseId, 
    { exerciseObservable: this.exerciseObservable,
      question: question, 
      questionText: questionText, 
      answerText: answerText, 
      answer: answer })
    this.cleanupFields()
  }

  isTextInvalid(text){
    return ($.trim(text) === '')
  }

  cleanupFields(){
    $('#exerciseQuestion').val('')
    $('#exerciseQuestionText').html('')
    $('#exerciseAnswer').val('')
    $('#exerciseAnswerText').html('')
  }

  uniqueId() {
    return Math.random().toString(36).substr(2, 10);
  };

  get(){
    const exerciseList = []
    console.log('exerciseMap', this.exerciseMap)
    for (var exerciseId in this.exerciseMap){
      var exercise = this.exerciseMap[exerciseId].get()
      exerciseList.push(exercise)
    }
    return exerciseList
  }

  </script>
</exercises>