<subject>
  <div class="field">
    <label class="label">Subject</label>
    <div class="control">
      <div class="autoSaveInput select">
      <select id="subjectSelect">
        <option value="Algebra">Algebra</option>
        <option value="Calculus">Calculus</option>
        <option value="Linear Algebra">Linear Algebra</option>
        <option value="Number Theory">Number Theory</option>
        <option value="Geometry">Geometry</option>
        <option value="Combinatorics">Combinatorics</option>
        <option value="Real Analysis">Real Analysis</option>
      </select>
      </div>
    </div>
  </div>
  <script>
  get(){
    return $("#subjectSelect option:selected" ).text();
  }
  set(subject){
    $('#subjectSelect').val(subject)
  }
  </script>
</subject>