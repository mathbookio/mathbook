<subject>
  <div class="field">
    <label class="label">Subject</label>
    <div class="control">
      <div class="select">
      <select id="subjectSelect">
        <option value="Algebra">Algebra</option>
        <option value="Calculus">Calculus</option>
        <option value="Linear Algebra">Linear Algebra</option>
        <option value="Number Theory">Number Theory</option>
        <option value="Geometry">Geometry</option>
        <option value="Combinatorics">Combinatorics</option>
      </select>
      </div>
    </div>
  </div>
  <script>
  get(){
    return $("#subjectSelect option:selected" ).text();
  }
  set(subject){
    console.log('subjectTag::subject', subject)
    $('#subjectSelect').val(subject)
  }
  </script>
</subject>