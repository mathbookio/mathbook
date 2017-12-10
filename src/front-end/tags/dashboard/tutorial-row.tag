<tutorial>
<tr>
  <td>{opts.name}</td>
  <td>{opts.status}</td>
  <!--  action cell  -->
  <td>
    <a class="button is-primary" onclick={editTutorial}>Edit</a>
    <a class="button is-danger" onclick={deleteTutorial}>Delete</a>
  </td>
  <td>{opts.timestamp}</td>
</tr>
<script>
editTutorial(){
  console.log("Editing Tutorial")
}
deleteTutorial(){
  console.log("Deleting Tutorial")
}
</script>
</tutorial>