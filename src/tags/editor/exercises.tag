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
      <input type="text" id="exerciseQuestion" class="input mathContent" placeholder="question"/>
    </div>
  </div>
  <div class="field">
    <div class="control">
      <textarea id="exerciseAnswer" class="textarea mathContent" placeholder="the answer..."></textarea>
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
    <a class="button is-info" onclick={ saveSection }>Save Section</a>
  </div>
  <br/>
    <div id="exerciseList">
    
    </div>
    </div>
  </section>
  
  <script>
    var that = this
    

  this.on('mount', function() {
    const exerciseList = document.getElementById('exerciseList')
    Sortable.create(exerciseList, { handle: '.moveHandle' });
    $('#exerciseQuestion').on('input', function(e) {
      var osText = $('#exerciseQuestion').val()
      $('#exerciseQuestionText').html(osText)
      MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'exerciseQuestionText'])
    });
    $('#exerciseAnswer').on('input', function(e) {
      var osText = $('#exerciseAnswer').val()
      $('#exerciseAnswerText').html(osText)
      MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'exerciseAnswerText'])
    });
  })

  saveSection(){
    var exerciseNumber = this.uniqueId()
    var exerciseId = 'exerciseBox_'+exerciseNumber

    var exerciseQuestion = $('#exerciseQuestion').val()
    var exerciseQuestionText = $('#exerciseQuestionText').html()
    var exerciseAnswer = $('#exerciseAnswer').val()
    var exerciseAnswerText = $('#exerciseAnswerText').html()
    $('#exerciseList').append('<exercise-section id="'+exerciseId+'"></exercise-section>')
    riot.mount('#'+exerciseId, { exerciseQuestion: exerciseQuestion, exerciseQuestionText: exerciseQuestionText, exerciseAnswerText: exerciseAnswerText, exerciseAnswer: exerciseAnswer })
    this.cleanupFields()
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

  </script>
</exercises>