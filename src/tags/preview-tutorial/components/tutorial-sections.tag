<tutorial-sections>
<section class="section my-section-margin" each={ sections }>
    <div class="container is-fluid">
      <div id={ fragment } class="title is-4">{ title }</div>
      <div id={'content_'+contentIndex} class="content preWrap"></div>
    </div>
  </section>
<script>
var that = this
this.sections = this.opts.sections || []

this.on('mount', function(){
  that.renderContent()
  that.update()
})

renderContent(){
  for (var section of this.sections){
    const sectionId = 'content_'+section.contentIndex
    console.log('section', section)
    $('#'+sectionId).html(section.text)
    const sectionContentElement = document.getElementById(sectionId)
    try{
      renderMathInElement(sectionContentElement)
    }
    catch(err){
      console.log(err)
    }
  }
}

set(data){
  console.log('tutorial-section', data)
  this.sections = data || []
  $(document).ready(function() {
  that.renderContent()
that.update()
  })
}
</script>
</tutorial-sections>