<subject>
  <div class="field">
    <label class="label">Subject</label>
    <div class="control">
      <div class="select">
      <select id="subjectSelect">
        <option>Elementary Algebra</option>
        <option>Calculus</option>
        <option>Linear Algebra</option>
        <option>Number Theory</option>
        <option>Geometry</option>
        <option>Combinatorics</option>
      </select>
      </div>
    </div>
  </div>
  <script>
  get(){
    return $("#subjectSelect option:selected" ).text();
  }
  </script>
</subject>