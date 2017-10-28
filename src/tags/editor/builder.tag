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
  <div class="container">
    <div class="level">
    <div class="level-item level-right">
      <button class="button is-success" onclick={saveState}>Save Current Tutorial State</div>
    </div>
  </div>
  </div>
</section>
  <script>
    this.on('mount', function() {
      this.pickConfiguration();
//      console.log('configData', this.tags.configuration)
 //     console.log('contentData', this.tags.content)
  //    console.log('exerciseData', this.tags.exercises)
    })
    pickConfiguration(){
      $("#configTab").addClass("is-active")
      $("#contentTab").removeClass("is-active")
      $("#exercisesTab").removeClass("is-active")
      $("#content").hide();
      $("#exercises").hide();
      $("#config").show();
    }
    pickContent(){
      $("#configTab").removeClass("is-active")
      $("#contentTab").addClass("is-active")
      $("#exercisesTab").removeClass("is-active")
      $("#content").show();
      $("#exercises").hide();
      $("#config").hide();
    }
    pickExercises(){
      $("#configTab").removeClass("is-active")
      $("#contentTab").removeClass("is-active")
      $("#exercisesTab").addClass("is-active")
      $("#content").hide();
      $("#exercises").show();
      $("#config").hide();
    }

    saveState(){
      console.log("CONFIG DATA", this.tags.configuration.get())
      console.log("CONTENT DATA", this.tags.content.get())
      console.log("EXERCISE DATA", this.tags.exercises.get())

    }
  </script>
</builder>
