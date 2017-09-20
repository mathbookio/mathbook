<builder>
<style>
  .mathContent{
    font-family: 'consolas';
  }
  .moveHandle{
    cursor: move;
  }
</style>
<section class="section">
  <div class="tabs is-centered is-boxed">
    <ul>
      <li id="configTab">
        <a onclick={pickConfiguration}>
          <span>Configuration</span>
        </a>
      </li>
      <li id="contentTab">
        <a onclick={pickContent}>
          <span>Content</span>
        </a>
      </li>
      <li id="exercisesTab">
        <a onclick={pickExercises}>
          <span>Exercises</span>
        </a>
      </li>
    </ul>
  </div>
  <configuration id="config"></configuration>
  <content id="content"></content>
  <exercises id="exercises"></exercises>
</section>
  <script>
    this.on('mount', function() {
      this.pickConfiguration();
    })
    
    pickConfiguration(){
      console.log("PICK CONFIGURATION")
      $("#configTab").addClass("is-active")
      $("#contentTab").removeClass("is-active")
      $("#exercisesTab").removeClass("is-active")
      $("#content").hide();
      $("#exercises").hide();
      $("#config").show();
    }
    pickContent(){
      console.log("PICK CONTENT")
      $("#configTab").removeClass("is-active")
      $("#contentTab").addClass("is-active")
      $("#exercisesTab").removeClass("is-active")
      $("#content").show();
      $("#exercises").hide();
      $("#config").hide();
    }
    pickExercises(){
      console.log("PICK EXERCISES")
      $("#configTab").removeClass("is-active")
      $("#contentTab").removeClass("is-active")
      $("#exercisesTab").addClass("is-active")
      $("#content").hide();
      $("#exercises").show();
      $("#config").hide();
    }
  </script>
</builder>
